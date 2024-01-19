import {
  date,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const availabilityStatusEnum = pgEnum("status", [
  "yes",
  "unclear",
  "no",
]);

export const polls = pgTable("polls", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 24 })
    .unique()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 256 }).notNull().default(""),
  description: text("description").notNull().default(""),
});

export const pollsAttendees = pgTable("polls_attendees", {
  id: uuid("id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id")
    .notNull()
    .references(() => polls.id),
  name: varchar("name", { length: 256 }).notNull().default(""),
});

export const availabilities = pgTable("availabilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id").references(() => polls.id),
  userId: uuid("user_id").references(() => pollsAttendees.id),
  date: date("date").notNull(),
  description: text("description").notNull().default(""),
  status: availabilityStatusEnum("status"),
});
