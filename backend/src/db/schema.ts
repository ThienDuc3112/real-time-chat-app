import { relations } from "drizzle-orm";
import {
  bigint,
  bigserial,
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  roomId: bigint("room_id", { mode: "bigint" }).references(() => rooms.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow(),
  editted: boolean("editted").default(false),
});

export const rooms = pgTable("rooms", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordDigest: varchar("password_digest", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

export const roomToMember = pgTable(
  "room_to_member",
  {
    roomId: bigint("room_id", { mode: "bigint" }).references(() => rooms.id),
    userId: integer("user_id").references(() => users.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.roomId, table.userId] }),
    };
  }
);

export const roomToMemberRelation = relations(roomToMember, ({ one }) => {
  return {
    user: one(users, {
      fields: [roomToMember.roomId],
      references: [users.id],
    }),
    room: one(rooms, {
      fields: [roomToMember.roomId],
      references: [rooms.id],
    }),
  };
});

export const messageRelation = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [messages.userId],
    references: [rooms.id],
  }),
}));

export const userRelation = relations(users, ({ many }) => ({
  messages: many(messages),
  rooms: many(roomToMember),
}));

export const roomRelation = relations(rooms, ({ many }) => ({
  messages: many(messages),
  users: many(roomToMember),
}));
