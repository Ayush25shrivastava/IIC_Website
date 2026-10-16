import {
  Admin,
  AdminAuthSession,
  AuthSession,
  CampusAmbassador,
  PromoCode,
  Registration,
  Task,
  TicketStageConfig,
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
  TicketStageConfig,
];

export async function ensureDatabaseIndexes() {
  for (const Model of indexedModels) {
    await Model.createIndexes();
    logger.debug({ model: Model.modelName }, "MongoDB indexes ensured");
  }
}
