/**
 * Preview or import campus ambassadors from the Google Forms CSV.
 * Run `npm run ambassador:import` to preview, adding `-- --apply` to create
 * missing accounts. Each account's initial password is the email prefix.
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import { CampusAmbassador } from "../src/models/index.js";

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
const inputPath = path.resolve(serverDirectory, argumentsMap.get("file") || "../CA_details - Form Responses 1.csv");

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
  return rows.map((row, index) => {
    const email = row["Email Address"].toLowerCase();
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

    return { email, name, college, phone, password: email.slice(0, email.indexOf("@")) };
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

try {
  const csv = await fs.readFile(inputPath, "utf8");
  const rows = normalizeRows(parseCsv(csv));

  await connectDatabase();

  let inserted = 0;
  let skipped = 0;
  await mongoose.connection.transaction(async (session) => {
    const emails = rows.map((row) => row.email);
    const existing = await CampusAmbassador.find({ email: { $in: emails } })
      .select("email")
      .session(session)
      .lean();
    const existingEmails = new Set(existing.map((record) => record.email));
    const newRows = rows.filter((row) => !existingEmails.has(row.email));
    skipped = existing.length;

    if (applyChanges && newRows.length > 0) {
      const records = await assignUniqueIds(newRows, session);
      await CampusAmbassador.insertMany(records, { session, ordered: true });
      inserted = records.length;
    }
  });

  console.log(JSON.stringify({
    database: mongoose.connection.name,
    csvRows: rows.length,
    existingAccounts: skipped,
    toCreate: rows.length - skipped,
    created: inserted,
    mode: applyChanges ? "applied" : "preview",
  }));
  if (!applyChanges) console.log('Preview only. Rerun with "--apply" to create the missing accounts.');
} catch (error) {
  console.error(error?.message || "Ambassador CSV import failed.");
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
