import { NextFunction, Response } from "express";
import { IUserRequest } from "../interfaces/IUserRequest";
import { verify } from "jsonwebtoken";
import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const safeGetUser = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies?.token;
  if (token) {
    verify(token, `${process.env.SECRET}`, async (err, user: any) => {
      if (!err) {
        req.user = (
          await db.select().from(users).where(eq(users.id, user.id))
        )[0];
      }
    });
  }
  next();
};

export const getUser = (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies?.token;
  if (token) {
    verify(token, `${process.env.SECRET}`, async (err, user: any) => {
      if (!err) {
        req.user = (
          await db.select().from(users).where(eq(users.id, user.id))
        )[0];
        if (!req.user) return res.status(401).send();
        next();
      } else {
        return res.status(401).send();
      }
    });
  } else return res.status(401).send();
};
