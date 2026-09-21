import "dotenv/config";
import { z } from "zod";

const mongoUriSchema = z
  .string()
  .min(1, "MONGODB_URI is required")
  .refine(
    (value) => value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
    "MONGODB_URI must start with mongodb:// or mongodb+srv://",
  );

const booleanFromEnv = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes"].includes(normalized)) return true;
  if (["false", "0", "no"].includes(normalized)) return false;
  return value;
}, z.boolean());

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5001),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(10).default(0),
  REQUEST_BODY_LIMIT: z.string().min(1).default("1mb"),
  CLIENT_ORIGIN: z.string().min(1, "CLIENT_ORIGIN is required"),
  MONGODB_URI: mongoUriSchema,
  MONGO_SERVER_SELECTION_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(10000),
  MONGO_MAX_POOL_SIZE: z.coerce.number().int().min(1).max(200).default(20),
  MONGO_MIN_POOL_SIZE: z.coerce.number().int().min(0).max(100).default(0),
  MONGO_FAMILY: z.coerce.number().int().refine((value) => [0, 4, 6].includes(value), {
    message: "MONGO_FAMILY must be 0, 4, or 6",
  }).default(4),
  MONGO_CONNECT_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(10000),
  MONGO_SOCKET_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(45000),
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ISSUER: z.string().min(1).default("renaissance-server1"),
  JWT_AUDIENCE: z.string().min(1).default("renaissance-campus-ambassador"),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().min(60).max(3600).default(900),
  JWT_REFRESH_TTL_DAYS: z.coerce.number().int().min(1).max(90).default(30),
  AUTH_COOKIE_SECURE: booleanFromEnv.optional(),
  AUTH_COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  AUTH_COOKIE_DOMAIN: z.string().trim().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid server1 environment configuration:\n${message}`);
}

const clientOrigins = parsed.data.CLIENT_ORIGIN
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (clientOrigins.length === 0) {
  throw new Error("CLIENT_ORIGIN must contain at least one allowed origin");
}

const cookieSecure = parsed.data.NODE_ENV === "production"
  ? true
  : (parsed.data.AUTH_COOKIE_SECURE ?? false);
const cookieDomain = parsed.data.AUTH_COOKIE_DOMAIN || undefined;

if (parsed.data.AUTH_COOKIE_SAME_SITE === "none" && !cookieSecure) {
  throw new Error("AUTH_COOKIE_SECURE must be true when AUTH_COOKIE_SAME_SITE=none");
}

export const env = Object.freeze({
  ...parsed.data,
  AUTH_COOKIE_SECURE: cookieSecure,
  AUTH_COOKIE_DOMAIN: cookieDomain,
  CLIENT_ORIGINS: clientOrigins,
});
