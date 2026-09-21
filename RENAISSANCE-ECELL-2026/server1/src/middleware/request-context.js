import { randomUUID } from "node:crypto";
import pinoHttp from "pino-http";
import { logger } from "../utils/logger.js";

export const requestLogger = pinoHttp({
  logger,
  genReqId(req, res) {
    const incomingId = req.headers["x-request-id"];
    const requestId = typeof incomingId === "string" && incomingId.trim()
      ? incomingId.trim().slice(0, 128)
      : randomUUID();

    res.setHeader("x-request-id", requestId);
    return requestId;
  },
  customLogLevel(_req, res, error) {
    if (error || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress,
      };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
  },
});
