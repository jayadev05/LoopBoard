import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address").trim(),
  password: z.string()
  .min(8, "Minimum 8 characters required")
  .trim()
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[a-z]/, "Must include at least one lowercase letter")
  .regex(/[0-9]/, "Must include at least one number")
  .regex(/[\W_]/, "Must include at least one special character")
  .regex(/^\S*$/, "No spaces allowed"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});