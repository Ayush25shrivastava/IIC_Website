import {
  Admin,
  AdminAuthSession,
  AuthSession,
  CampusAmbassador,
  PromoCode,
  Registration,
  Task,
  Ticket,
  TicketStageConfig,
  VolunteerScanner,
} from "../models/index.js";
import { logger } from "../utils/logger.js";

const indexedModels = [
  Admin,
  AdminAuthSession,
  AuthSession,
  CampusAmbassador,
  PromoCode,
  Registration,
  Task,
  Ticket,
  TicketStageConfig,
  VolunteerScanner,
];

async function removeUniqueTransactionIdIndex(Model) {
  const indexes = await Model.collection.indexes();
  for (const index of indexes) {
    if (index.unique && index.key?.transactionId === 1) {
      await Model.collection.dropIndex(index.name);
      logger.info({ model: Model.modelName, index: index.name }, "Removed unique transaction ID index");
    }
  }
}

export async function ensureDatabaseIndexes() {
  // Remove the legacy ticket index that can reject a reused UTR.
  await removeUniqueTransactionIdIndex(Ticket);
  for (const Model of indexedModels) {
    await Model.createIndexes();
    logger.debug({ model: Model.modelName }, "MongoDB indexes ensured");
  }
}
