import { z } from "zod";
import { REGISTRATION_STATUS, TASK_STATUS } from "../constants/domain.js";

const TASK_ID_PATTERN = /^TASK-[A-Z0-9][A-Z0-9-]{2,39}$/;

const paginationFields = {
  page: z.coerce.number().int().min(1).max(100000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
};

export const taskIdParamsSchema = z.object({
  taskId: z
    .string()
    .trim()
    .toUpperCase()
    .regex(TASK_ID_PATTERN, "Invalid task ID"),
});

export const ambassadorTaskListQuerySchema = z.object({
  ...paginationFields,
  status: z.enum(Object.values(TASK_STATUS)).optional(),
});

export const ambassadorTaskStatusSchema = z.object({
  status: z.enum(Object.values(TASK_STATUS)),
});

export const ambassadorTaskDetailsSchema = z
  .object({
    remarks: z.string().trim().max(2000).optional(),
    completionDetails: z.string().trim().max(4000).optional(),
  })
  .refine(
    (value) => value.remarks !== undefined || value.completionDetails !== undefined,
    "Provide remarks or completionDetails",
  );

export const ambassadorReferralListQuerySchema = z.object({
  ...paginationFields,
  status: z.enum(Object.values(REGISTRATION_STATUS)).optional(),
});
