import { and, eq } from "drizzle-orm";
import { db } from "../db/client";
import { roomToMember, rooms, users } from "../db/schema";
import { verifyAccessToken } from "../helper/verifyToken";
import { TEventHandler } from "../interfaces/TEventHandler";
import { joinRoomSchema } from "../zodSchemas/joinRoom";

export const joinRoom: TEventHandler = (_, socket) => {
    socket.on("joinRoom", async (req: any) => {
        try {
            const action = joinRoomSchema.parse(req);
            const userId = verifyAccessToken(action.accessToken);
            if (userId === undefined) throw { name: "InvalidToken" };
            const user = (
                await db.select().from(users).where(eq(users.id, userId))
            )[0];
            if (!user) throw { name: "NonExistenceUser" };
            const room = (
                await db.select().from(rooms).where(eq(rooms.id, action.roomId))
            )[0];
            if (!room) throw { name: "NonExistenceRoom" };
            const connection = await db.select().from(roomToMember).where(and(eq(roomToMember.roomId, room.id), eq(roomToMember.userId, user.id)))
            if(connection.length == 0) throw {name: "Unauthorzied"}
            socket.join(room.id.toString())
        } catch (error) {
            socket.emit("error", error);
        }
    });
};
