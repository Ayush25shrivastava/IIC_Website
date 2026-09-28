import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import * as models from "../src/models/index.js";

// Dry run by default. No drops, deletes, index replacement, or automatic conflict resolution.
const apply = process.argv.includes("--apply");
try {
  await mongoose.connect(env.MONGODB_URI, { autoIndex: false, autoCreate: false });
  let conflicts = 0;
  for (const Model of Object.values(models)) {
    for (const [keys, options] of Model.schema.indexes()) {
      if (!options.unique) continue;
      const duplicates = await Model.aggregate([
        { $match: options.partialFilterExpression || {} },
        { $group: { _id: Object.fromEntries(Object.keys(keys).map((key) => [key, { $ifNull: [`$${key}`, null] }])), count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } }, { $count: "groups" },
      ]);
      const count = duplicates[0]?.groups || 0;
      if (count) { conflicts += count; console.error(`${Model.collection.name}: ${options.name}: ${count} conflicting groups`); }
      const indexes = await Model.collection.listIndexes().toArray().catch((error) => { if (error.code === 26) return []; throw error; });
      const existing = indexes.find((index) => index.name === options.name);
      if (existing && (JSON.stringify(existing.key) !== JSON.stringify(keys) || !existing.unique || JSON.stringify(existing.partialFilterExpression) !== JSON.stringify(options.partialFilterExpression))) {
        conflicts += 1; console.error(`${Model.collection.name}: ${options.name}: incompatible existing index`);
      }
    }
  }
  const ambiguousCredentials = await models.CampusAmbassador.countDocuments({ password: { $type: "string" }, passwordHash: { $type: "string" } });
  if (ambiguousCredentials) { conflicts += ambiguousCredentials; console.error(`${ambiguousCredentials} accounts have both credential formats; reconcile explicitly before migration.`); }
  if (conflicts) throw new Error("Conflicts detected. No migration changes were made.");
  const hashedCount = await models.CampusAmbassador.countDocuments({ passwordHash: { $type: "string" }, password: { $exists: false } });
  console.log(`Preflight passed. Hashed accounts awaiting login or reset: ${hashedCount}. Mode: ${apply ? "apply" : "dry run"}.`);
  // Existing hashes cannot be decoded. Preserve credentials in both migration modes.
  if (apply) {
    for (const Model of Object.values(models)) await Model.createIndexes();
    await models.Task.updateMany({ status: "COMPLETED", $or: [{ reviewStatus: { $exists: false } }, { reviewStatus: "NONE" }] }, { $set: { reviewStatus: "PENDING" } });
    console.log("Migration complete. Accounts, IDs, tasks, registrations and historical attribution preserved.");
  }
} catch (error) {
  // Avoid printing database URLs, credentials, or document values on failure.
  console.error(`Migration stopped (${error.name}). Check connectivity, permissions and the preflight diagnostics.`);
  process.exitCode = 1;
} finally { await mongoose.disconnect(); }
