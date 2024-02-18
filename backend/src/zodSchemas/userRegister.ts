import { z } from "zod";

export const userRegisterInfo = z
  .object({
    username: z.string().min(3).max(50),
    email: z.string().email("Invalid email"),
    password: z.string(),
    passwordVerification: z.string(),
  })
  .refine((userData) => userData.password == userData.passwordVerification, {
    message: "password and passwordVerification must be equal",
    path: ["passwordVerification"],
  });
