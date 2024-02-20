import { verify } from "jsonwebtoken";
import { z } from "zod";
import { accessTokenSchema, refreshTokenSchema } from "../zodSchemas/tokens";

export const verifyAccessToken = (token: string): number | undefined => {
  try {
    token = z.string().parse(token);
    let res: number | undefined = undefined;
    verify(token, `${process.env.SECRET}`, (err, data) => {
      try {
        const user = accessTokenSchema.parse(data);
        res = user.id;
      } catch (error) {}
    });
    return res;
  } catch (error) {
    return undefined;
  }
};

export const verifyRefreshToken = (token: string): number | undefined => {
  try {
    token = z.string().parse(token);
    let res: number | undefined = undefined;
    verify(token, `${process.env.SECRET}`, (err, data) => {
      try {
        const user = refreshTokenSchema.parse(data);
        res = user.id;
      } catch (error) {}
    });
    return res;
  } catch (error) {
    return undefined;
  }
};
