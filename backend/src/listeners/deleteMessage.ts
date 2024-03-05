import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { messages, users } from "../db/schema";
import { verifyAccessToken } from "../helper/verifyToken";
import { TEventHandler } from "../interfaces/TEventHandler";
import { deleteMessageSchema } from "../zodSchemas/deleteMessage";

export const deleteMessage: TEventHandler = (io, socket) => {
  socket.on("deleteMessage", async (_: any) => {
    try {
      const messageAction = deleteMessageSchema.parse(_);
      const userId = verifyAccessToken(messageAction.accessToken);
      if (userId === undefined) throw { name: "InvalidToken" };
      const user = (
        await db.select().from(users).where(eq(users.id, userId))
      )[0];
      if (user === undefined) throw { name: "NonExistenceUser" };
      const message = (
        await db
          .select()
          .from(messages)
          .where(eq(messages.id, messageAction.id))
      )[0];
      if (message === undefined) throw { name: "NonExistenceMessage" };
      if (message.userId !== user.id) throw { name: "Unauthorized" };
      await db.delete(messages).where(eq(messages.id, messageAction.id));
      io.to(message.roomId.toString()).emit("messageDeleted", {
        id: message.id.toString(),
        roomId: message.roomId.toString(),
      });
    } catch (error) {
      socket.emit("error", error);
    }
  });
};
