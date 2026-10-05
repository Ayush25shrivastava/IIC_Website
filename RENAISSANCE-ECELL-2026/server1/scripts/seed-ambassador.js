/**
 * Seed script: creates a demo Campus Ambassador, promo code, and sample tasks.
 *
 * Usage:
 *   node scripts/seed-ambassador.js
 *
 * Test environments only. A random password is printed once after creation.
 */
import crypto from "node:crypto";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import { CampusAmbassador, PromoCode, Task, Registration } from "../src/models/index.js";

const SEED_EMAIL = "ambassador@renaissance.test";
if (process.env.NODE_ENV !== "test") {
  throw new Error("Fixture seeding is restricted to NODE_ENV=test. Use ambassador:create for real accounts.");
}
const SEED_PASSWORD = `Test-${crypto.randomBytes(24).toString("base64url")}!`;

try {
  await connectDatabase();

  // Check if the demo ambassador already exists
  const existing = await CampusAmbassador.findOne({ email: SEED_EMAIL });
  if (existing) {
    console.log("Test ambassador already exists; no changes made.");
    await disconnectDatabase();
    process.exit(0);
  }

  // 1. Create the ambassador
  const ambassador = await CampusAmbassador.create({
    ambassadorId: "CA-RNX-SEED",
    name: "Aarav Sharma",
    email: SEED_EMAIL,
    college: "IET Lucknow",
    password: SEED_PASSWORD,
    mustChangePassword: false,
    status: "ACTIVE",
    role: "CAMPUS_AMBASSADOR",
  });
  console.log(`✔ Ambassador created: ${ambassador.ambassadorId}`);

  // 2. Create a promo code
  const promo = await PromoCode.create({
    code: "RENAARAV10",
    ambassadorId: ambassador._id,
    isActive: true,
  });
  console.log(`✔ Promo code created: ${promo.code}`);

  // 3. Create sample tasks
  const tasks = await Task.insertMany([
    {
      taskId: "TASK-RNX-001",
      ambassadorId: ambassador._id,
      title: "Share the event launch post",
      description:
        "Post the Renaissance announcement in your college communities and tag the event page.",
      status: "IN_PROGRESS",
      remarks: "Shared with two student groups; one more to go.",
      dueAt: new Date("2026-09-24T23:59:59Z"),
    },
    {
      taskId: "TASK-RNX-002",
      ambassadorId: ambassador._id,
      title: "Reach out to student clubs",
      description:
        "Contact three entrepreneurship or technology clubs and invite their members to register.",
      status: "ASSIGNED",
      dueAt: new Date("2026-09-26T23:59:59Z"),
    },
    {
      taskId: "TASK-RNX-003",
      ambassadorId: ambassador._id,
      title: "Host a classroom introduction",
      description:
        "Give a short introduction to Renaissance and share your registration code.",
      status: "COMPLETED",
      remarks: "Introduced the summit in two first-year classes.",
      completionDetails: "Covered sections A and B of the first-year batch.",
      startedAt: new Date("2026-09-15T10:00:00Z"),
      completedAt: new Date("2026-09-18T14:00:00Z"),
      dueAt: new Date("2026-09-18T23:59:59Z"),
    },
    {
      taskId: "TASK-RNX-004",
      ambassadorId: ambassador._id,
      title: "Share the registration link",
      description:
        "Post the registration link in WhatsApp groups and Instagram stories.",
      status: "COMPLETED",
      remarks: "Posted in 5 WhatsApp groups.",
      completionDetails: "Screenshots saved in drive link.",
      startedAt: new Date("2026-09-14T09:00:00Z"),
      completedAt: new Date("2026-09-17T16:00:00Z"),
      dueAt: new Date("2026-09-17T23:59:59Z"),
    },
  ]);
  console.log(`✔ ${tasks.length} tasks created`);

  // 4. Create sample registrations attributed to this ambassador
  const registrations = await Registration.insertMany([
    {
      registrationId: "RNX-REG-001",
      name: "Priya Verma",
      email: "priya.v@example.test",
      phone: "+919876543210",
      college: "IET Lucknow",
      packageId: ambassador._id,
      packageCode: "FEST",
      packageName: "Festival Pass",
      baseAmountPaise: 49900,
      discountAmountPaise: 0,
      finalAmountPaise: 49900,
      promoCodeId: promo._id,
      promoCode: promo.code,
      ambassadorId: ambassador._id,
    },
    {
      registrationId: "RNX-REG-002",
      name: "Rohit Kumar",
      email: "rohit.k@example.test",
      phone: "+919876543211",
      college: "MNNIT Allahabad",
      packageId: ambassador._id,
      packageCode: "FEST",
      packageName: "Festival Pass",
      baseAmountPaise: 49900,
      discountAmountPaise: 0,
      finalAmountPaise: 49900,
      promoCodeId: promo._id,
      promoCode: promo.code,
      ambassadorId: ambassador._id,
    },
    {
      registrationId: "RNX-REG-003",
      name: "Sneha Gupta",
      email: "sneha.g@example.test",
      phone: "+919876543212",
      college: "IET Lucknow",
      packageId: ambassador._id,
      packageCode: "PREMIUM",
      packageName: "Premium Pass",
      baseAmountPaise: 99900,
      discountAmountPaise: 10000,
      finalAmountPaise: 89900,
      promoCodeId: promo._id,
      promoCode: promo.code,
      ambassadorId: ambassador._id,
    },
  ]);
  console.log(`✔ ${registrations.length} sample registrations created`);

  console.log("\n════════════════════════════════════════════");
  console.log("  SEED DATA READY");
  console.log("════════════════════════════════════════════");
  console.log(`  Email:    ${SEED_EMAIL}`);
  console.log(`  Password: ${SEED_PASSWORD}`);
  console.log("════════════════════════════════════════════\n");
} catch (error) {
  console.error("Seed failed:", error.message || error);
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
