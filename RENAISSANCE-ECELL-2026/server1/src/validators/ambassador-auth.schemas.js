import { z } from "zod";

const email = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .max(254)
  .transform((value) => value.toLowerCase());

const strongPassword = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number");

export const ambassadorLoginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required").max(512),
}).strict();

export const ambassadorChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required").max(512),
  newPassword: strongPassword,
}).strict().superRefine((value, ctx) => {
  if (value.currentPassword === value.newPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["newPassword"],
      message: "New password must be different from the current password",
    });
  }
});
