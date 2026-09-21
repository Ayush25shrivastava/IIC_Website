import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { requireDatabaseReady } from "./middleware/database-ready.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { requestLogger } from "./middleware/request-context.js";
import { ambassadorAuthRouter } from "./routes/ambassador-auth.routes.js";
import { adminAuthRouter } from "./routes/admin-auth.routes.js";
import { adminManagementRouter } from "./routes/admin-management.routes.js";
import { ambassadorDashboardRouter } from "./routes/ambassador-dashboard.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { ApiError } from "./utils/api-error.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", env.TRUST_PROXY_HOPS > 0 ? env.TRUST_PROXY_HOPS : false);

app.use(requestLogger);
app.use(helmet());
app.use(compression());
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    origin(origin, callback) {
      if (!origin || env.CLIENT_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new ApiError(403, "Origin is not allowed by CORS", "CORS_ORIGIN_DENIED"));
    },
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: env.REQUEST_BODY_LIMIT }));
app.use(express.urlencoded({ extended: false, limit: env.REQUEST_BODY_LIMIT }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    service: "renaissance-server1",
    status: "ok",
    message: "Renaissance 2026 API is running",
    apiVersion: "v1",
    endpoints: {
      health: "/api/v1/health",
      readiness: "/api/v1/ready",
      ambassadorAuth: "/api/v1/ambassador/auth",
      ambassadorPortal: "/api/v1/ambassador",
      adminAuth: "/api/v1/admin/auth",
      adminPortal: "/api/v1/admin",
    },
    requestId: req.id,
  });
});

app.use("/api/v1", healthRouter);
app.use("/api/v1/ambassador/auth", requireDatabaseReady, ambassadorAuthRouter);
app.use("/api/v1/ambassador", requireDatabaseReady, ambassadorDashboardRouter);
app.use("/api/v1/admin/auth", requireDatabaseReady, adminAuthRouter);
app.use("/api/v1/admin", requireDatabaseReady, adminManagementRouter);

app.use(notFoundHandler);
app.use(errorHandler);
