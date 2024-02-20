import { z } from "zod";
import { TEventHandler } from "../interfaces/TEventHandler";
import { verifyAccessToken } from "../helper/verifyToken";
import { db } from "../db/client";
import { roomToMember, users } from "../db/schema";
import { eq } from "drizzle-orm";

export const joinAllRooms: TEventHandler = (io, socket) => {
  socket.once("joinAllRoom", async (token: string) => {
    try {
      token = z.string().parse(token);
      const userId = verifyAccessToken(token);
      if (userId === undefined) throw { name: "InvalidToken" };
      const user = (
        await db.select().from(users).where(eq(users.id, userId))
      )[0];
      if (user === undefined) throw { name: "NonExistenceUser" };
      const userRooms = await db
        .select({ id: roomToMember.roomId })
        .from(roomToMember)
        .where(eq(roomToMember.userId, user.id));
      userRooms.forEach(({ id }) => {
        socket.join(id.toString());
      });
    } catch (error) {
      socket.emit("error", error);
    }
  });
};
