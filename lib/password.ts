import { z } from "zod";

export const PASSWORD_RULES =
  "At least 8 characters, 1 uppercase letter, and 1 special character";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/,
    "Password must contain at least 1 special character"
  );

export function validatePassword(password: string): string | null {
  const result = passwordSchema.safeParse(password);
  if (result.success) return null;
  return result.error.errors[0]?.message ?? PASSWORD_RULES;
}
