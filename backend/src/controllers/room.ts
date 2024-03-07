import { Response } from "express";
import { IUserRequest } from "../interfaces/IUserRequest";
import { db } from "../db/client";
import { messages, roomToMember, rooms, users } from "../db/schema";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import { inviteSchema } from "../zodSchemas/inviteSchema";

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

export const invite = async (req: IUserRequest, res: Response) => {
  if (!req.user) return res.sendStatus(401);
  try {
    const action = inviteSchema.parse(req.body);
    const room = (
      await db
        .select()
        .from(roomToMember)
        .where(
          and(
            eq(roomToMember.userId, req.user.id),
            eq(roomToMember.roomId, action.roomId)
          )
        )
    )[0];
    if (!room) return res.status(404).json({ name: "NonExistenceRoom" });
    let members: (typeof users.$inferSelect)[] = [];
    if (action.users.length > 0)
      members = await db
        .select()
        .from(users)
        .where(inArray(users.id, action.users));
    if (members.length > 0)
      await db
        .insert(roomToMember)
        .values(
          members.map((user) => ({ roomId: room.roomId, userId: user.id }))
        );
    return res.sendStatus(204);
  } catch (error) {
    res.status(400).send(error);
  }
};
