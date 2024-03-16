import { Response } from "express";
import { IUserRequest } from "../interfaces/IUserRequest";
import { db } from "../db/client";
import { messages, roomToMember, rooms, users } from "../db/schema";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

export const createRoom = async (req: IUserRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    try {
        console.log(req.body)
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
        res.sendStatus(400);
    }
};

// export const invite = async (req: IUserRequest, res: Response) => {
//     if (!req.user) return res.sendStatus(401);
//     try {
//         const action = inviteSchema.parse(req.body);
//         const room = (
//             await db
//                 .select()
//                 .from(roomToMember)
//                 .where(
//                     and(
//                         eq(roomToMember.userId, req.user.id),
//                         eq(roomToMember.roomId, action.roomId)
//                     )
//                 )
//         )[0];
//         if (!room) return res.status(404).json({ name: "NonExistenceRoom" });
//         let members: (typeof users.$inferSelect)[] = [];
//         if (action.users.length > 0)
//             members = await db
//                 .select()
//                 .from(users)
//                 .where(inArray(users.id, action.users));
//         if (members.length > 0)
//             await db
//                 .insert(roomToMember)
//                 .values(
//                     members.map((user) => ({ roomId: room.roomId, userId: user.id }))
//                 );
//         return res.sendStatus(204);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// };

export const join = async (req: IUserRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    try {
        const roomId = BigInt(req.params.id)
        const room = (await db.select().from(rooms).where(eq(rooms.id, roomId)))[0]
        if (!room) return res.status(404).json({ name: "NonExistenceRoom" });
        if (room.roomType == "direct_message") return res.status(401).json({ name: "CannotJoinDM" })
        await db.insert(roomToMember).values({ roomId: room.id, userId: req.user.id })
        return res.json({ ...room, id: room.id.toString() })
    } catch (err) {
        res.status(400).send({ name: "InvalidRoomId" });
    }
}
