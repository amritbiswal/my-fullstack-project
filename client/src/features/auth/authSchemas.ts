import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(3, "Enter your email or phone"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().min(6, "Invalid phone").optional().or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["TOURIST", "PROVIDER_INDIVIDUAL", "PROVIDER_BUSINESS"])
  });

export type RegisterForm = z.infer<typeof registerSchema>;
