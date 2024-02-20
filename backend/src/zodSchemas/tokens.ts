import { z } from "zod";

export const accessTokenSchema = z.object({
  id: z.number(),
});

export const refreshTokenSchema = z.object({
  id: z.number(),
  isRefresh: z
    .boolean()
    .refine((value) => value, "isRefresh must present and be true"),
});
