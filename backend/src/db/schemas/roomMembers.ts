import { bigint, integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { rooms } from "./rooms";
import { users } from "./user";

export const roomToMember = pgTable(
  "roomToMember",
  {
    roomId: bigint("roomId", { mode: "bigint" }).references(() => rooms.id),
    userId: integer("userId").references(() => users.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.roomId, table.userId] }),
    };
  }
);
