import crypto from "node:crypto";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import { ADMIN_ROLE } from "../src/constants/domain.js";
import { Admin } from "../src/models/index.js";
import { hashPassword } from "../src/utils/password.js";

function arg(name) {
  const prefix = `--${name}=`;
  return process.argv.slice(2).find((value) => value.startsWith(prefix))?.slice(prefix.length).trim() || null;
}

const name = arg("name");
const email = arg("email")?.toLowerCase();
const role = (arg("role") || ADMIN_ROLE.SUPER_ADMIN).toUpperCase();
if (!name || !email || !Object.values(ADMIN_ROLE).includes(role)) {
  console.error('Usage: npm run admin:create -- --name="Main Admin" --email=admin@example.com --role=SUPER_ADMIN');
  process.exitCode = 1;
} else {
  const password = `RnX!${crypto.randomBytes(14).toString("base64url")}9a`;
  try {
    await connectDatabase();
    const admin = await Admin.create({
      adminId: `AD-RNX-${crypto.randomBytes(5).toString("hex").toUpperCase()}`,
      name, email, role,
      passwordHash: await hashPassword(password),
      mustChangePassword: true,
    });
    console.log("Admin created.");
    console.log(`Admin ID: ${admin.adminId}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Temporary password: ${password}`);
    console.log("Store the temporary password securely; it will not be shown again.");
  } catch (error) {
    console.error(error?.message || error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}
