import { getDatabaseState } from "../config/db.js";
import { ApiError } from "../utils/api-error.js";

export function requireDatabaseReady(_req, _res, next) {
  const database = getDatabaseState();

  if (!database.ready) {
    next(new ApiError(
      503,
      "Database is temporarily unavailable. The API is online and will reconnect automatically.",
      "DATABASE_UNAVAILABLE",
    ));
    return;
  }

  next();
}
