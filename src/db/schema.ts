import {
  date,
  pgEnum,
  pgTable,
  text,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

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

export const pollsRelations = relations(polls, ({ many }) => ({
  attendees: many(attendees),
}));

export const attendees = pgTable("attendees", {
  id: uuid("id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id")
    .notNull()
    .references(() => polls.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 256 }).notNull().default(""),
});

export const attendeesRelations = relations(attendees, ({ one, many }) => ({
  poll: one(polls, {
    fields: [attendees.pollId],
    references: [polls.id],
  }),
  availabilities: many(availabilities),
}));

export const availabilities = pgTable(
  "availabilities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    attendeeId: uuid("attendee_id").references(() => attendees.id, {
      onDelete: "cascade",
    }),
    date: date("date").notNull(),
    description: text("description").notNull().default(""),
    status: availabilityStatusEnum("status"),
  },
  (t) => ({
    uniqueDateAndAttendee: unique().on(t.date, t.attendeeId),
  }),
);

export const availabilitiesRelations = relations(availabilities, ({ one }) => ({
  attendee: one(attendees, {
    fields: [availabilities.attendeeId],
    references: [attendees.id],
  }),
}));
