import { relations } from "drizzle-orm";
import {
    bigint,
    bigserial,
    boolean,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    serial,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const roomType = pgEnum("room_type", ["direct_message", "normal"]);
export const memberRoleType = pgEnum("member_role_type", ["member", "moderator", "owner"]);

export const rooms = pgTable("rooms", {
    id: bigserial("id", { mode: "bigint" }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    roomType: roomType("room_type").notNull().default("normal"),
});

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    passwordDigest: varchar("password_digest", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
});

export const messages = pgTable("messages", {
    id: bigserial("id", { mode: "bigint" }).primaryKey(),
    roomId: bigint("room_id", { mode: "bigint" })
        .references(() => rooms.id, {
            onDelete: "cascade",
        })
        .notNull(),
    userId: integer("user_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),
    content: text("content").notNull(),
    timestamp: timestamp("timestamp", { mode: "date" }).defaultNow().notNull(),
    editted: boolean("editted").default(false).notNull(),
});

export const roomToMember = pgTable(
    "room_to_member",
    {
        roomId: bigint("room_id", { mode: "bigint" })
            .references(() => rooms.id, {
                onDelete: "cascade",
            })
            .notNull(),
        userId: integer("user_id")
            .references(() => users.id, {
                onDelete: "cascade",
            })
            .notNull(),
        role: memberRoleType("role").notNull().default("member")
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.roomId, table.userId] }),
        };
    }
);

export const friendships = pgTable(
    "friendships",
    {
        user1: integer("user1")
            .references(() => users.id, {
                onDelete: "cascade",
            })
            .notNull(),
        user2: integer("user2").references(() => users.id, {
            onDelete: "cascade",
        }),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.user1, table.user2] }),
        };
    }
);

export const inviteLink = pgTable(
    "invitelink",
    {
        id: bigserial("id", { mode: "bigint" }),
        roomId: bigint("room_id", { mode: "bigint" })
            .references(() => rooms.id, {
                onDelete: "cascade",
            }).notNull(),
        validTill: timestamp("validTill").notNull()
    }
)

export const friendshipsRelation = relations(friendships, ({ one }) => {
    return {
        user1: one(users, {
            fields: [friendships.user1],
            references: [users.id],
        }),
        user2: one(users, {
            fields: [friendships.user2],
            references: [users.id],
        }),
    };
});

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
    friendships: many(friendships),
}));

export const roomRelation = relations(rooms, ({ many }) => ({
    messages: many(messages),
    users: many(roomToMember),
    inviteLink: many(inviteLink),
}));

export const inviteRelation = relations(inviteLink, ({ one }) => ({
    roomId: one(rooms),
}))
