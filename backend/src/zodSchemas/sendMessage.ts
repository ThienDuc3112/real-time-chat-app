import { z } from "zod";

export const sendMessageSchema = z.object({
  to: z
    .bigint()
    .or(z.string())
    .refine((value) => {
      try {
        BigInt(value);
        return true;
      } catch (error) {
        return false;
      }
    }, "Must be a bigint or a stringify bigint")
    .transform((value) => BigInt(value)),
  content: z.string(),
  accessToken: z.string(),
});
