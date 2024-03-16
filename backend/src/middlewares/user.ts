import { NextFunction, Response } from "express";
import { IUserRequest } from "../interfaces/IUserRequest";
import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { verifyAccessToken } from "../helper/verifyToken";

export const safeGetUser = async (
  req: IUserRequest,
  _: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.headers.authorization?.split(" ")[1];
  if (!token) return next();
  const user = verifyAccessToken(token);
  if (user === undefined) return next();
  req.user = (await db.select().from(users).where(eq(users.id, user)))[0];
  next();
};

export const getUser = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send();
  const user = verifyAccessToken(token);
  if (user === undefined) {
    return res.status(401).send();
  }
  req.user = (await db.select().from(users).where(eq(users.id, user)))[0];
  if (!req.user) return res.status(401).send();
  next();
};
