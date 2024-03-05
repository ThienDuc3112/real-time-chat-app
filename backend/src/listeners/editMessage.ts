import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { messages, users } from "../db/schema";
import { TEventHandler } from "../interfaces/TEventHandler";
import { verifyAccessToken } from "../helper/verifyToken";
import { editMessageSchema } from "../zodSchemas/editMessage";

export const editMessage: TEventHandler = (io, socket) => {
  socket.on("editMessage", async (_: any) => {
    try {
      const action = editMessageSchema.parse(_);
      const userId = verifyAccessToken(action.accessToken);
      if (userId === undefined) throw { name: "InvalidToken" };
      const user = (
        await db.select().from(users).where(eq(users.id, userId))
      )[0];
      if (!user) throw { name: "NonExistenceUser" };
      const message = (
        await db.select().from(messages).where(eq(messages.id, action.id))
      )[0];
      if (!message) throw { name: "NonExistenceMessage" };
      if (message.userId !== user.id) throw { name: "Unauthorized" };
      await db
        .update(messages)
        .set({ content: action.content, editted: true })
        .where(eq(messages.id, action.id));
      io.to(message.roomId.toString()).emit("messageEdited", {
        id: message.id.toString(),
        roomId: message.roomId.toString(),
        content: action.content,
        eddited: true,
      });
    } catch (err) {
      socket.emit("error", err);
    }
  });
};
