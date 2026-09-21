import { Router } from "express";
import { getDatabaseState } from "../config/db.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "renaissance-server1",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get("/ready", (_req, res) => {
  const database = getDatabaseState();
  const ready = database.ready;

  res.status(ready ? 200 : 503).json({
    success: ready,
    status: ready ? "ready" : "not_ready",
    checks: {
      database,
    },
    timestamp: new Date().toISOString(),
  });
});
