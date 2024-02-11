import {
  bigint,
  bigserial,
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { rooms } from "./rooms";
import { users } from "./user";

export const messages = pgTable("messages", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  roomId: bigint("roomId", { mode: "bigint" }).references(() => rooms.id),
  userId: integer("userId").references(() => users.id),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow(),
  editted: boolean("editted").default(false),
});
