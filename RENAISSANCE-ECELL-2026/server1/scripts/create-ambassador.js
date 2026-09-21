import crypto from "node:crypto";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import { CampusAmbassador } from "../src/models/index.js";
import { hashPassword } from "../src/utils/password.js";

function arg(name) {
  const prefix = `--${name}=`;
  const item = process.argv.slice(2).find((value) => value.startsWith(prefix));
  return item?.slice(prefix.length).trim() || null;
}

const input = {
  ambassadorId: arg("id"),
  name: arg("name"),
  email: arg("email")?.toLowerCase(),
  college: arg("college"),
};

const missing = Object.entries(input).filter(([, value]) => !value).map(([key]) => key);
if (missing.length) {
  console.error(`Missing arguments: ${missing.join(", ")}`);
  console.error(
    'Usage: npm run ambassador:create -- --id=CA-RNX-0001 --name="Campus Captain" --email=captain@example.com --college="MNNIT Allahabad"',
  );
  process.exitCode = 1;
} else {
  const temporaryPassword = `RnX!${crypto.randomBytes(12).toString("base64url")}9a`;

  try {
    await connectDatabase();
    const ambassador = await CampusAmbassador.create({
      ...input,
      passwordHash: await hashPassword(temporaryPassword),
      mustChangePassword: true,
    });

    console.log("Campus ambassador created.");
    console.log(`Ambassador ID: ${ambassador.ambassadorId}`);
    console.log(`Email: ${ambassador.email}`);
    console.log(`Temporary password: ${temporaryPassword}`);
    console.log("Store the temporary password securely; it will not be shown again.");
  } catch (error) {
    console.error(error?.message || error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}
