import { z } from "zod";

export const userLoginInfo = z.object({
  username: z.string().email().or(z.string()),
  password: z.string(),
});
