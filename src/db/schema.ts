import {
  date,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const availabilityStatusEnum = pgEnum("status", ["yes", "maybe", "no"]);

export const polls = pgTable("polls", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 24 })
    .unique()
    .notNull()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 256 }).notNull().default(""),
  description: text("description").notNull().default(""),
});

export const attendees = pgTable("attendees", {
  id: uuid("id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id")
    .notNull()
    .references(() => polls.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 256 }).notNull().default(""),
});

export const availabilities = pgTable("availabilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id").references(() => polls.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id").references(() => attendees.id, {
    onDelete: "cascade",
  }),
  date: date("date").notNull(),
  description: text("description").notNull().default(""),
  status: availabilityStatusEnum("status"),
});
