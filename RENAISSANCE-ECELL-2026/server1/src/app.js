import compression from "compression";
import { fileURLToPath } from "node:url";
import { adminPagesRouter } from "./routes/admin-pages.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { requestLogger } from "./middleware/request-context.js";
import { ambassadorAuthRouter } from "./routes/ambassador-auth.routes.js";
import { adminAuthRouter } from "./routes/admin-auth.routes.js";
import { adminManagementRouter } from "./routes/admin-management.routes.js";
import { ambassadorDashboardRouter } from "./routes/ambassador-dashboard.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { ApiError } from "./utils/api-error.js";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import passport from "passport";
import passportConfig from "./config/passport.js";

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

app.use(passport.initialize());
const googleAuthEnabled = passportConfig(passport);

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
app.use("/api/v1/ambassador/auth", ambassadorAuthRouter);
app.use("/api/v1/ambassador", ambassadorDashboardRouter);
app.use("/api/v1/admin", (_req, res, next) => {
  res.set({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" });
  next();
});
app.use("/api/v1/admin/auth", adminAuthRouter);
app.use("/api/v1/admin", adminManagementRouter);

app.use("/auth", (_req, _res, next) => {
  if (!googleAuthEnabled) {
    return next(new ApiError(503, "Google sign-in is not configured", "GOOGLE_AUTH_NOT_CONFIGURED"));
  }
  next();
}, authRoutes);
app.use("/events", eventRoutes);
app.use("/teams", teamRoutes);
app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);

// Optional same-origin production serving. Existing homepage/API routes remain unchanged.
app.use(["/renaissance/admin", "/admin"], adminPagesRouter);
app.use("/assets", express.static(fileURLToPath(new URL("../../client/dist/assets", import.meta.url))));
app.use(notFoundHandler);
app.use(errorHandler);
