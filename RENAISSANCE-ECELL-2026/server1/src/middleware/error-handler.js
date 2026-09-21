import { env } from "../config/env.js";

function isDatabaseConnectivityError(error) {
  const name = String(error?.name || "");
  const message = String(error?.message || "");
  const reasonType = String(error?.reason?.type || "");

  return (
    name === "MongoServerSelectionError"
    || name === "MongoNetworkError"
    || reasonType === "ReplicaSetNoPrimary"
    || /tlsv1 alert|ssl routines|econnreset|etimedout|enetunreach|ehostunreach/i.test(message)
  );
}

export function errorHandler(error, req, res, _next) {
  if (error?.code === 11000) {
    error.statusCode = 409;
    error.code = "DUPLICATE_RESOURCE";
    error.message = "A resource with the same unique value already exists";
    error.details = { fields: Object.keys(error.keyPattern || error.keyValue || {}) };
  } else if (error?.name === "ValidationError") {
    error.statusCode = 400;
    error.code = "MODEL_VALIDATION_ERROR";
    error.details = Object.values(error.errors || {}).map((item) => ({
      path: item.path,
      message: item.message,
    }));
  }

  const databaseUnavailable = isDatabaseConnectivityError(error);
  const statusCode = databaseUnavailable
    ? 503
    : (Number.isInteger(error.statusCode) ? error.statusCode : 500);
  const errorCode = databaseUnavailable
    ? "DATABASE_UNAVAILABLE"
    : (error.code || "INTERNAL_SERVER_ERROR");
  const isServerError = statusCode >= 500;

  req.log?.[isServerError ? "error" : "warn"](
    { err: error, statusCode },
    isServerError ? "Request failed" : "Request rejected",
  );

  const publicMessage = databaseUnavailable
    ? "The database connection is temporarily unavailable. Check MongoDB Atlas network access and retry."
    : (
      isServerError && env.NODE_ENV === "production"
        ? "An unexpected server error occurred"
        : error.message
    );

  const payload = {
    success: false,
    error: {
      code: errorCode,
      message: publicMessage,
      requestId: req.id,
    },
  };

  if (error.details !== undefined) {
    payload.error.details = error.details;
  }

  if (env.NODE_ENV !== "production" && error.stack) {
    payload.error.stack = error.stack;
  }

  if (databaseUnavailable) {
    res.set("Retry-After", "5");
  }

  res.status(statusCode).json(payload);
}
