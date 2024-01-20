import { addDays, format } from "date-fns";
import { availabilities } from "./../db/schema";
import { db } from "@/db";
import { procedure, router } from "./trpc";
import { attendees, polls } from "@/db/schema";
import { z } from "zod";
import { eq, and, between } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

const insertPollSchema = createInsertSchema(polls);
const selectPollSchema = createSelectSchema(polls);

const insertAttendeeSchema = createInsertSchema(attendees);
const selectAttendeeSchema = createSelectSchema(attendees);
// const smth = insertPollSchema.pick({ slug: true })

export const appRouter = router({
  getPoll: procedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const [poll] = await db
        .select()
        .from(polls)
        .where(eq(polls.slug, input.slug));
      return poll;
    }),
  updatePollMetadata: procedure
    .input(
      z.object({
        slug: z.string(),
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ input: { slug, ...rest } }) => {
      const [poll] = await db
        .update(polls)
        .set(rest)
        .where(eq(polls.slug, slug))
        .returning({
          name: polls.name,
          description: polls.description,
        });
      return poll;
    }),
  createPoll: procedure.mutation(async () => {
    const [poll] = await db
      .insert(polls)
      .values({})
      .returning({ slug: polls.slug });
    return poll.slug;
  }),
  attendee: router({
    create: procedure
      .input(insertAttendeeSchema)
      .mutation(async ({ input }) => {
        const [attendee] = await db.insert(attendees).values(input).returning();
        return attendee;
      }),
    list: procedure
      .input(z.object({ pollId: z.string() }))
      .query(async ({ input }) => {
        const attendeeList = await db
          .select()
          .from(attendees)
          .where(eq(attendees.pollId, input.pollId));
        return attendeeList;
      }),
    delete: procedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.delete(attendees).where(eq(attendees.id, input.id));
      }),
    update: procedure
      .input(z.object({ id: z.string(), name: z.string() }))
      .mutation(async ({ input }) => {
        const [attendee] = await db
          .update(attendees)
          .set({ name: input.name })
          .where(eq(attendees.id, input.id))
          .returning();
        return attendee;
      }),
  }),
  availability: router({
    list: procedure
      .input(z.object({ pollId: z.string() }))
      .query(async ({ input }) => {
        const toPostgresDate = (date: Date) => format(date, "yyyy-MM-dd");
        const todayDate = new Date();
        const today = toPostgresDate(todayDate);
        const dateIn30Days = toPostgresDate(addDays(todayDate, 30));
        return await db
          .select()
          .from(availabilities)
          .where(
            and(
              eq(availabilities.pollId, input.pollId),
              between(availabilities.date, today, dateIn30Days),
            ),
          );
      }),
  }),
});

export type AppRouter = typeof appRouter;
