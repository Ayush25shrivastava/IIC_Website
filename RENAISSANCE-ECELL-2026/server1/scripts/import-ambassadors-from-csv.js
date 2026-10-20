/**
 * Preview or import campus ambassadors from the private Google Forms CSV.
 * Run `npm run ambassador:import` to preview, adding `-- --apply` to create or
 * update accounts and assign any missing permanent promo codes.
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import { AuthSession, CampusAmbassador, PromoCode } from "../src/models/index.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const serverDirectory = path.resolve(scriptDirectory, "..");
const argumentsMap = new Map(
  process.argv.slice(2).filter((arg) => arg.startsWith("--") && arg.includes("="))
    .map((arg) => {
      const separator = arg.indexOf("=");
      return [arg.slice(2, separator), arg.slice(separator + 1)];
    }),
);
const applyChanges = process.argv.includes("--apply");
const shortenPromoCodes = process.argv.includes("--shorten-promos");
const inputPath = path.resolve(serverDirectory, argumentsMap.get("file") || "seed-data/CA_details - Form Responses 1.csv");

const REQUIRED_COLUMNS = ["Email Address", "Name", "College Name", "Contact Number (Preferably Whatsapp)"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{7,19}$/;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (inQuotes) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      if (field.length !== 0) throw new Error("Malformed CSV: quote inside an unquoted field.");
      inQuotes = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      if (character === "\r" && text[index + 1] === "\n") index += 1;
    } else {
      field += character;
    }
  }

  if (inQuotes) throw new Error("Malformed CSV: unterminated quoted field.");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const nonEmptyRows = rows.filter((values) => values.some((value) => value.trim() !== ""));
  if (nonEmptyRows.length < 2) throw new Error("CSV must include a header and at least one data row.");

  const headers = nonEmptyRows[0].map((value, index) =>
    (index === 0 ? value.replace(/^\uFEFF/, "") : value).trim(),
  );
  const duplicateHeaders = headers.filter((header, index) => headers.indexOf(header) !== index);
  if (duplicateHeaders.length) throw new Error("CSV contains duplicate column names.");

  const missingColumns = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
  if (missingColumns.length) throw new Error(`CSV is missing required columns: ${missingColumns.join(", ")}`);

  return nonEmptyRows.slice(1).map((values, rowIndex) => {
    if (values.length !== headers.length) {
      throw new Error(`CSV row ${rowIndex + 2} has ${values.length} fields; expected ${headers.length}.`);
    }
    return Object.fromEntries(headers.map((header, index) => [header, values[index].trim()]));
  });
}

function normalizeRows(rows) {
  const seenEmails = new Set();
  const seenPhones = new Set();
  return rows.map((row, index) => {
    const rawEmail = row["Email Address"];
    const email = rawEmail.toLowerCase();
    const name = row.Name;
    const college = row["College Name"];
    const phone = row["Contact Number (Preferably Whatsapp)"];
    const line = index + 2;

    if (!EMAIL_PATTERN.test(email)) throw new Error(`CSV row ${line} has an invalid email address.`);
    if (name.length < 2 || name.length > 120) throw new Error(`CSV row ${line} has an invalid name.`);
    if (college.length < 2 || college.length > 180) throw new Error(`CSV row ${line} has an invalid college name.`);
    if (!PHONE_PATTERN.test(phone)) throw new Error(`CSV row ${line} has an invalid contact number.`);
    if (seenEmails.has(email)) throw new Error(`CSV contains a duplicate email at row ${line}.`);
    seenEmails.add(email);

    const username = phone.replace(/\D/g, "");
    if (username.length < 8 || username.length > 20) throw new Error(`CSV row ${line} has an invalid phone-based username.`);
    if (seenPhones.has(username)) throw new Error(`CSV contains a duplicate phone-based username at row ${line}.`);
    seenPhones.add(username);
    return { email, name, college, phone: username, username, password: rawEmail.slice(0, rawEmail.indexOf("@")) };
  });
}

function newAmbassadorId() {
  return `CA-RNX-IMP-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
}

async function assignUniqueIds(rows, session) {
  const ids = new Set();
  const assigned = [];
  for (const row of rows) {
    let ambassadorId;
    do {
      ambassadorId = newAmbassadorId();
    } while (ids.has(ambassadorId) || await CampusAmbassador.exists({ ambassadorId }).session(session));
    ids.add(ambassadorId);
    assigned.push({
      ...row,
      ambassadorId,
      role: "CAMPUS_AMBASSADOR",
      status: "ACTIVE",
      mustChangePassword: false,
    });
  }
  return assigned;
}

async function uniquePromoCode(name, session, usedCodes) {
  let code;
  do {
    code = `RNX-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  } while (usedCodes.has(code) || await PromoCode.exists({ code }).session(session));
  usedCodes.add(code);
  return code;
}

try {
  const csv = await fs.readFile(inputPath, "utf8");
  const rows = normalizeRows(parseCsv(csv));

  await connectDatabase();

  let created = 0;
  let updated = 0;
  let existingCount = 0;
  let promosShortened = 0;
  await mongoose.connection.transaction(async (session) => {
    const emails = rows.map((row) => row.email);
    const existing = await CampusAmbassador.find({ email: { $in: emails } })
      .select("+password +passwordHash +authVersion")
      .session(session)
      .exec();
    existingCount = existing.length;
    const existingByEmail = new Map(existing.map((record) => [record.email, record]));
    const phoneCollisions = await CampusAmbassador.find({ phone: { $in: rows.map((row) => row.phone) }, email: { $nin: emails } }).select("_id").session(session).lean();
    if (phoneCollisions.length) throw new Error("A CSV phone username is already assigned to a different ambassador account.");

    if (applyChanges || shortenPromoCodes) {
      const usedCodes = new Set();
      for (const row of rows) {
        let ambassador = existingByEmail.get(row.email);
        if (shortenPromoCodes) {
          if (!ambassador) throw new Error("All CSV accounts must be seeded before shortening their promo codes.");
          let primaryPromo = await PromoCode.findOne({ ambassadorId: ambassador._id, isPrimary: true }).session(session);
          if (primaryPromo && /^RNX-[A-F0-9]{8}$/.test(primaryPromo.code)) continue;
          const code = await uniquePromoCode(row.name, session, usedCodes);
          if (applyChanges) {
            if (primaryPromo) {
              primaryPromo.code = code;
              await primaryPromo.save({ session });
            } else {
              primaryPromo = await PromoCode.create([{
                code, ambassadorId: ambassador._id, isPrimary: true, discountType: "NONE", discountValue: 0,
              }], { session }).then(([createdPromo]) => createdPromo);
            }
          }
          promosShortened += 1;
          continue;
        }
        if (!applyChanges) continue;
        if (ambassador) {
          ambassador.name = row.name;
          ambassador.email = row.email;
          ambassador.college = row.college;
          ambassador.phone = row.phone;
          ambassador.password = row.password;
          ambassador.passwordHash = undefined;
          ambassador.status = "ACTIVE";
          ambassador.mustChangePassword = false;
          ambassador.disabledAt = null;
          ambassador.archivedAt = null;
          ambassador.authVersion = (ambassador.authVersion ?? 0) + 1;
          await ambassador.save({ session });
          await AuthSession.deleteMany({ ambassadorId: ambassador._id }).session(session);
          updated += 1;
        } else {
          const [idRow] = await assignUniqueIds([row], session);
          [ambassador] = await CampusAmbassador.create([idRow], { session });
          created += 1;
        }
        const primaryPromo = await PromoCode.findOne({ ambassadorId: ambassador._id, isPrimary: true }).session(session);
        if (!primaryPromo) {
          await PromoCode.create([{
            code: await uniquePromoCode(row.name, session, usedCodes),
            ambassadorId: ambassador._id,
            isPrimary: true,
            discountType: "NONE",
            discountValue: 0,
          }], { session });
        }
      }
    }
  });

  console.log(JSON.stringify({
    database: mongoose.connection.name,
    csvRows: rows.length,
    existingAccounts: existingCount,
    toCreate: rows.length - existingCount,
    toUpdate: existingCount,
    created,
    updated,
    promoCodesShortened: promosShortened,
    mode: applyChanges ? "applied" : "preview",
  }));
  if (!applyChanges) console.log('Preview only. Rerun with "--apply" to apply these account and promo-code changes.');
} catch (error) {
  console.error(error?.message || "Ambassador CSV import failed.");
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
