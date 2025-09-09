import { email, z } from "zod";

export const LoginUserSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const RegisterUserSchema = z.object({
  email: z.email(),
  password: z.string(),
  name: z.string(),
});
