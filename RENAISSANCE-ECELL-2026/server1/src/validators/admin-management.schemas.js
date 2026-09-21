import { z } from "zod";
import { AMBASSADOR_STATUS, DISCOUNT_TYPE, REGISTRATION_STATUS, TASK_STATUS } from "../constants/domain.js";

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid MongoDB object id");
const page = z.coerce.number().int().min(1).default(1);
const limit = z.coerce.number().int().min(1).max(100).default(20);
const optionalText = (max) => z.string().trim().max(max).optional();

export const adminIdParamsSchema = z.object({
  id: z.string().trim().min(1).max(64),
});
export const promoIdParamsSchema = z.object({ promoId: objectId });
export const taskAdminParamsSchema = z.object({ taskId: z.string().trim().toUpperCase().regex(/^TASK-[A-Z0-9][A-Z0-9-]{2,39}$/) });

export const ambassadorListQuerySchema = z.object({
  page, limit,
  status: z.enum(Object.values(AMBASSADOR_STATUS)).optional(),
  search: optionalText(80),
  college: optionalText(120),
}).strict();

export const createAmbassadorSchema = z.object({
  ambassadorId: z.string().trim().toUpperCase().regex(/^CA-[A-Z0-9][A-Z0-9-]{2,31}$/).optional(),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().min(8).max(24).optional(),
  college: z.string().trim().min(2).max(180),
}).strict();

export const updateAmbassadorSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  phone: z.union([z.string().trim().min(8).max(24), z.null()]).optional(),
  college: z.string().trim().min(2).max(180).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, { message: "At least one field is required" });

export const ambassadorStatusSchema = z.object({
  status: z.enum(Object.values(AMBASSADOR_STATUS)),
}).strict();

export const promoListQuerySchema = z.object({
  page, limit,
  ambassadorId: objectId.optional(),
  isActive: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
  search: optionalText(40),
}).strict();

const discountFields = {
  discountType: z.enum(Object.values(DISCOUNT_TYPE)).default(DISCOUNT_TYPE.NONE),
  discountValue: z.coerce.number().min(0).default(0),
  maxUses: z.union([z.coerce.number().int().min(1), z.null()]).default(null),
  isActive: z.boolean().default(true),
  isPrimary: z.boolean().default(true),
  validFrom: z.coerce.date().nullable().default(null),
  validUntil: z.coerce.date().nullable().default(null),
};

export const createPromoSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9][A-Z0-9-]{2,31}$/),
  ambassadorId: objectId,
  ...discountFields,
}).strict();

export const updatePromoSchema = z.object({
  discountType: z.enum(Object.values(DISCOUNT_TYPE)).optional(),
  discountValue: z.coerce.number().min(0).optional(),
  maxUses: z.union([z.coerce.number().int().min(1), z.null()]).optional(),
  isActive: z.boolean().optional(),
  isPrimary: z.boolean().optional(),
  validFrom: z.coerce.date().nullable().optional(),
  validUntil: z.coerce.date().nullable().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, { message: "At least one field is required" });

export const promoStatusSchema = z.object({ isActive: z.boolean() }).strict();

export const taskListAdminQuerySchema = z.object({
  page, limit,
  ambassadorId: objectId.optional(),
  status: z.enum(Object.values(TASK_STATUS)).optional(),
  search: optionalText(80),
}).strict();

export const createTaskSchema = z.object({
  title: z.string().trim().min(3).max(180),
  description: z.string().trim().min(3).max(2000),
  ambassadorId: objectId,
}).strict();

export const updateTaskAdminSchema = z.object({
  title: z.string().trim().min(3).max(180).optional(),
  description: z.string().trim().min(3).max(2000).optional(),
  status: z.enum(Object.values(TASK_STATUS)).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, { message: "At least one field is required" });

export const assignTaskSchema = z.object({ ambassadorId: objectId }).strict();

export const adminReferralListQuerySchema = z.object({
  page, limit,
  ambassadorId: objectId.optional(),
  promoCode: optionalText(32),
  status: z.enum(Object.values(REGISTRATION_STATUS)).optional(),
  search: optionalText(80),
}).strict();
