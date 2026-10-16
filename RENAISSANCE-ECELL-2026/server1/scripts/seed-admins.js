import crypto from "node:crypto";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import { ADMIN_ROLE, ADMIN_STATUS } from "../src/constants/domain.js";
import { Admin } from "../src/models/index.js";
import { hashPassword } from "../src/utils/password.js";

const ADMINS_TO_SEED = [
  {
    name: "Admin 1",
    email: "admin1@mnnit.ac.in",
    password: "adminren2026",
    role: ADMIN_ROLE.SUPER_ADMIN,
  },
  {
    name: "Admin 2",
    email: "admin2@mnnit.ac.in",
    password: "adminren2026",
    role: ADMIN_ROLE.SUPER_ADMIN,
  },
  {
    name: "Admin 3",
    email: "admin3@mnnit.ac.in",
    password: "adminren2026",
    role: ADMIN_ROLE.SUPER_ADMIN,
  },
];

async function seedAdmins() {
  try {
    await connectDatabase();
    console.log("Connected to database. Starting admin seeding...");

    for (const item of ADMINS_TO_SEED) {
      const email = item.email.toLowerCase().trim();
      const passwordHash = await hashPassword(item.password);

      const existing = await Admin.findOne({ email });

      if (existing) {
        existing.name = item.name;
        existing.passwordHash = passwordHash;
        existing.status = ADMIN_STATUS.ACTIVE;
        existing.role = item.role;
        existing.mustChangePassword = false;
        existing.authVersion = (existing.authVersion ?? 0) + 1;
        await existing.save();
        console.log(`Updated admin: ${email} (${existing.adminId})`);
      } else {
        const adminId = `AD-RNX-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
        const created = await Admin.create({
          adminId,
          name: item.name,
          email,
          role: item.role,
          status: ADMIN_STATUS.ACTIVE,
          passwordHash,
          mustChangePassword: false,
          authVersion: 0,
        });
        console.log(`Created admin: ${email} (${created.adminId})`);
      }
    }

    console.log("Admin seeding completed successfully.");
  } catch (error) {
    console.error("Failed to seed admins:", error?.message || error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

seedAdmins();
