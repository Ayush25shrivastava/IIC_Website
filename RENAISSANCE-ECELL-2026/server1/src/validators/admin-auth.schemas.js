import { z } from "zod";

const password = z.string().min(10).max(200)
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number");

export const adminLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
}).strict();

export const adminChangePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: password,
}).strict().refine((value) => value.currentPassword !== value.newPassword, {
  path: ["newPassword"],
  message: "New password must be different from the current password",
});
