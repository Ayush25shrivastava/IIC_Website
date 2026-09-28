import { getDatabaseState } from "../config/db.js";
import { ApiError } from "../utils/api-error.js";

export function assertDatabaseReady() {
  const database = getDatabaseState();

  if (!database.ready) {
    throw new ApiError(
      503,
      "Database is temporarily unavailable. The API is online and will reconnect automatically.",
      "DATABASE_UNAVAILABLE",
    );
  }
}

export function requireDatabaseReady(_req, _res, next) {
  try {
    assertDatabaseReady();
    next();
  } catch (error) {
    next(error);
  }
}
