import { Response } from "express";
import { IUserRequest } from "../interfaces/IUserRequest";
import { db } from "../db/client";
import { inviteLink, messages, roomToMember, rooms, users } from "../db/schema";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { inviteSchema } from "../zodSchemas/inviteSchema";
import { io } from "../index"

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
        return res.json({ ...room, id: room.id.toString() });
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getAllRooms = async (req: IUserRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    const userRooms = await db
        .select({ id: rooms.id, name: rooms.name, roomType: rooms.roomType })
        .from(roomToMember).where(eq(roomToMember.userId, req.user.id)).rightJoin(
            rooms,
            eq(rooms.id, roomToMember.roomId)
        )
    res.json(
        userRooms.map((room) => ({
            ...room,
            id: room.id.toString(),
        }))
    );
};

export const getRoomMessages = async (req: IUserRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    try {
        const roomId = BigInt(req.params.roomId);
        const inTheRoom = await db.select().from(roomToMember).where(and(
            eq(roomToMember.roomId, roomId),
            eq(roomToMember.userId, req.user.id)
        ))
        if (inTheRoom.length == 0) return res.sendStatus(401);
        const resMessages = await db
            .select()
            .from(messages)
            .where(eq(messages.roomId, roomId))
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
        res.status(400).send({ name: "InvalidRoomId" });
    }
};

export const createInvite = async (req: IUserRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    try {
        const action = inviteSchema.parse(req.body);
        const inRoom = (await db.select().from(roomToMember).where(and(eq(roomToMember.userId, req.user.id), eq(roomToMember.roomId, action.roomId))))[0]
        if (!inRoom) throw { name: "Unauthorized" }
        const inv = (await db.insert(inviteLink).values({ roomId: action.roomId, validTill: new Date(action.validFor == 0 ? 0 : Date.now() + action.validFor) }).returning())[0]
        res.json(inv)
    } catch (err) {
        res.status(400).json(err)
    }
}

export const removeRoom = async (req: IUserRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    try {
        const roomId = BigInt(req.params.roomId);
        const role = (await db.select().from(roomToMember).where(and(eq(roomToMember.userId, req.user.id), eq(roomToMember.roomId, roomId))))[0]
        if (!role || role.role == "member") {
            return res.status(401).json({ name: "Unauthorized" });
        }
        const room = (await db.delete(rooms).where(eq(rooms.id, roomId)).returning())[0]
        io.to(roomId.toString()).emit("roomDeleted", { ...room, id: room.id.toString() })
        io.in(roomId.toString()).socketsLeave(roomId.toString())
        return res.sendStatus(204)
    } catch (err) {
        res.status(400).send({ name: "InvalidRoomId" });
    }
}

export const editRoomName = async (req: IUserRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    try {
        const roomId = BigInt(req.params.roomId);
        const newRoomName = z.string().safeParse(req.body.name)
        if (!newRoomName.success) return res.status(400).json({ name: "InvalidRoomName" })
        const role = (await db.select().from(roomToMember).where(and(
            eq(roomToMember.roomId, roomId),
            eq(roomToMember.userId, req.user.id)
        )))[0]
        if (!role || role.role == "member") return res.status(401).send({ name: "Unauthorized" });
        const updatedRoom = (await db.update(rooms).set({name: newRoomName.data}).where(eq(rooms.id, roomId)).returning())[0]
        return res.json({...updatedRoom, id: updatedRoom.id.toString()})
    } catch (err) {
        res.status(400).send({ name: "InvalidRoomId" });
    }
}

export const join = async (req: IUserRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    try {
        const invId = BigInt(req.params.id)
        const data = (await db.select().from(inviteLink).where(eq(inviteLink.roomId, invId)).fullJoin(rooms, eq(inviteLink.roomId, rooms.id)))[0]
        if (!data || !data.rooms || !data.invitelink) return res.status(400).json({ name: "InvalidLink" })
        const room = data.rooms;
        const invite = data.invitelink;
        if (invite.validTill.getTime() != 0 && invite.validTill.getTime() < Date.now()) {
            await db.delete(inviteLink).where(eq(inviteLink.id, invite.id));
            return res.status(404).send({ name: "Invitelink expired" })
        }
        if (room.roomType == "direct_message") return res.status(401).json({ name: "CannotJoinDM" })
        await db.insert(roomToMember).values({ roomId: room.id, userId: req.user.id })
        return res.json({ ...room, id: room.id.toString() })
    } catch (err) {
        res.status(400).send({ name: "InvalidRoomId" });
    }
}
