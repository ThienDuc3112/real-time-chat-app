import { bigserial, pgTable, varchar } from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});
