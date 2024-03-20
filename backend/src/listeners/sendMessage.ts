import { and, eq } from "drizzle-orm";
import { db } from "../db/client";
import { messages, roomToMember, rooms, users } from "../db/schema";
import { verifyAccessToken } from "../helper/verifyToken";
import { TEventHandler } from "../interfaces/TEventHandler";
import { sendMessageSchema } from "../zodSchemas/sendMessage";

export const sendMessage: TEventHandler = (io, socket) => {
    socket.on("sendMessage", async (_: any) => {
        try {
            const action = sendMessageSchema.parse(_);
            const userId = verifyAccessToken(action.accessToken);
            if (userId === undefined) throw { name: "InvalidToken" };
            const user = (
                await db.select().from(users).where(eq(users.id, userId))
            )[0];
            if (!user) throw { name: "NonExistenceUser" };
            const room = (
                await db.select().from(rooms).where(eq(rooms.id, action.to))
            )[0];
            if (!room) throw { name: "NonExistenceRoom" };
            const connection = await db.select().from(roomToMember).where(and(eq(roomToMember.roomId, room.id), eq(roomToMember.userId, user.id)))
            if (connection.length == 0) throw { name: "Unauthorzied" }
            const message = await db
                .insert(messages)
                .values({
                    content: action.content,
                    roomId: room.id,
                    userId: user.id,
                })
                .returning();
            io.to(room.id.toString()).emit("incomingMessage", {
                ...message[0],
                roomId: message[0].roomId.toString(),
                id: message[0].id.toString(),
                username: user.username
            });
        } catch (error) {
            socket.emit("error", error);
        }
    });
};
