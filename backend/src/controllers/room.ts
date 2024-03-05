import { Response } from "express";
import { IUserRequest } from "../interfaces/IUserRequest";
import { db } from "../db/client";
import { messages, roomToMember, rooms, users } from "../db/schema";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";

export const createRoom = async (req: IUserRequest, res: Response) => {
  if (!req.user) return res.sendStatus(401);
  try {
    const roomName = z.string().parse(req.body.name);
    const m = z.number().array().safeParse(req.body.members);
    const room = (
      await db
        .insert(rooms)
        .values({
          name: roomName,
        })
        .returning()
    )[0];
    await db.insert(roomToMember).values({
      roomId: room.id,
      userId: req.user.id,
    });
    if (m.success && m.data.length > 0) {
      (
        await db
          .select({ id: users.id })
          .from(users)
          .where(inArray(users.id, m.data))
      ).forEach(async (user) => {
        await db.insert(roomToMember).values({
          roomId: room.id,
          userId: user.id,
        });
      });
    }
    return res.json({ id: room.id.toString(), name: room.name });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getAllRooms = async (req: IUserRequest, res: Response) => {
  if (!req.user) return res.sendStatus(401);
  const userRooms = await db
    .select({ id: rooms.id, name: rooms.name, roomType: rooms.roomType })
    .from(rooms)
    .leftJoin(
      roomToMember,
      and(
        eq(rooms.id, roomToMember.roomId),
        eq(roomToMember.userId, req.user.id)
      )
    );
  res.json(
    userRooms.map((room) => ({
      id: room.id.toString(),
      name: room.name,
      roomType: room.roomType,
    }))
  );
};

export const getRoomMessages = async (req: IUserRequest, res: Response) => {
  if (!req.user) return res.sendStatus(401);
  try {
    const roomId = BigInt(req.params.roomId);
    const resMessages = await db
      .select()
      .from(messages)
      .where(and(eq(messages.roomId, roomId), eq(messages.userId, req.user.id)))
      .leftJoin(users, eq(users.id, messages.userId));
    res.json(
      resMessages.map((msg) => ({
        ...msg.messages,
        id: msg.messages.id.toString(),
        roomId: msg.messages.roomId.toString(),
        username: msg.users?.username,
      }))
    );
  } catch (err) {
    res.sendStatus(400);
  }
};
