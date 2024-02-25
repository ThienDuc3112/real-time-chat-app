import { Response } from "express";
import { IUserRequest } from "../interfaces/IUserRequest";
import { db } from "../db/client";
import { messages, roomToMember, rooms } from "../db/schema";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

export const createRoom = async (req: IUserRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    try {
        const roomName = z.string().parse(req.body.name);
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
        return res.json({ id: room.id.toString(), name: room.name });
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getAllRooms = async (req: IUserRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    const userRooms = await db
        .select({ id: rooms.id, name: rooms.name })
        .from(rooms)
        .leftJoin(
            roomToMember,
            and(
                eq(rooms.id, roomToMember.roomId),
                eq(roomToMember.userId, req.user.id)
            )
        );
    res.json(
        userRooms.map((room) => ({ id: room.id.toString(), name: room.name }))
    );
};

export const getRoomMessages = async (req: IUserRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    try {
        const roomId = BigInt(req.params.roomId);
        const resMessages = await db.select().from(messages).where(and(eq(messages.roomId, roomId), eq(messages.userId, req.user.id)));
        res.json(resMessages.map(msg => ({
            ...msg,
            id: msg.id.toString(),
            roomId: msg.roomId.toString()
        })))
    } catch (err) {
        res.sendStatus(400);
    }
}
