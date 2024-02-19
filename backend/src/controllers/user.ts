import { Request, Response } from "express";
import { userRegisterInfo } from "../zodSchemas/userRegister";
import { db } from "../db/client";
import { users } from "../db/schema";
import { genSalt, hash, compare } from "bcrypt";
import { userLoginInfo } from "../zodSchemas/userLogin";
import { eq, or } from "drizzle-orm";
import { sign, verify } from "jsonwebtoken";
import { IUserRequest } from "../interfaces/IUserRequest";
import { z } from "zod";

export const register = async (req: Request, res: Response) => {
  const requestBody = userRegisterInfo.safeParse(req.body);
  if (!requestBody.success) return res.status(400).send(requestBody.error);
  const { data } = requestBody;
  const user = await db
    .selectDistinct({
      username: users.username,
    })
    .from(users)
    .where(eq(users.username, data.username));
  if (user.length > 0) return res.status(409).send();
  const salt = await genSalt(10);
  const passwordDigest = await hash(data.password, salt);
  const resVal = await db
    .insert(users)
    .values({
      username: data.username,
      email: data.email,
      passwordDigest,
    })
    .returning({ id: users.id });

  return res.json(resVal[0]);
};

export const login = async (req: Request, res: Response) => {
  const reqBody = userLoginInfo.safeParse(req.body);
  if (!reqBody.success) return res.status(400).json(reqBody.error);
  const data = reqBody.data;
  const userQuery = await db
    .selectDistinct()
    .from(users)
    .where(
      or(eq(users.username, data.username), eq(users.email, data.username))
    );
  if (userQuery.length == 0) return res.status(404).send();
  const user = userQuery[0];
  const isCorrectPassword = await compare(data.password, user.passwordDigest);
  if (!isCorrectPassword)
    return res.status(401).json({ password: "Incorrect password" });
  const expiredAt = Date.now() + 15 * 60 * 1000;
  const token = sign({ id: user.id }, `${process.env.SECRET}`, {
    expiresIn: "15m",
  });
  const refreshToken = sign(
    { id: user.id, isRefresh: true },
    `${process.env.SECRET}`,
    {
      expiresIn: "1d",
    }
  );
  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
    })
    .json({ token, expiredAt });
};

export const deleteUser = async (req: IUserRequest, res: Response) => {
  if (!req.user) return res.sendStatus(401);
  try {
    const password = z.string().parse(req.body?.password);
    if (await compare(password, req.user.passwordDigest)) {
      const result = await db
        .delete(users)
        .where(eq(users.id, req.user.id))
        .returning();
      return res.json(result);
    } else return res.sendStatus(401);
  } catch (error) {
    return res.status(401).json({ message: "Password not provided" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken: string | undefined = req.cookies?.refreshToken;
  if (refreshToken) {
    verify(refreshToken, `${process.env.SECRET}`, (err, data: any) => {
      if (!err && data?.isRefresh) {
        const expiredAt = Date.now() + 15 * 60 * 1000;
        const token = sign({ id: data.id }, `${process.env.SECRET}`, {
          expiresIn: "15m",
        });

        res.json({ token, expiredAt });
      } else return res.status(401).json({ message: "Invalid refresh token" });
    });
  } else return res.status(400).json({ message: "refreshToken not found" });
};
