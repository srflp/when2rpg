import { availabilities } from "../db/schema";
import { db } from "@/db";
import { attendees, polls } from "@/db/schema";
import { z } from "zod";
import { eq, gte, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { initTRPC } from "@trpc/server";
import { httpBatchLink } from "@trpc/client";
import { getApiUrl } from "@/server/url";

const t = initTRPC.create();
const router = t.router;
const procedure = t.procedure;

const insertAttendeeSchema = createInsertSchema(attendees);

export const appRouter = router({
  poll: router({
    create: procedure.mutation(async () => {
      const [poll] = await db
        .insert(polls)
        .values({})
        .returning({ slug: polls.slug });
      return poll.slug;
    }),
    get: procedure
      .input(
        z.object({
          slug: z.string(),
        }),
      )
      .query(
        async ({ input }) =>
          await db.query.polls.findFirst({
            where: eq(polls.slug, input.slug),
            with: {
              attendees: {
                columns: {
                  pollId: false,
                },
                with: {
                  availabilities: {
                    columns: {
                      description: false,
                      id: false,
                      attendeeId: false,
                    },
                    where: gte(availabilities.date, sql`CURRENT_DATE`),
                  },
                },
              },
            },
          }),
      ),
    updateMetadata: procedure
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
  }),
  attendee: router({
    create: procedure
      .input(insertAttendeeSchema)
      .mutation(async ({ input }) => {
        const [attendee] = await db.insert(attendees).values(input).returning();
        return attendee.id;
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
    set: procedure
      .input(
        z.object({
          date: z.string(),
          attendeeId: z.string(),
          status: z.enum(["yes", "no", "maybe"]),
        }),
      )
      .mutation(
        async ({ input }) =>
          await db
            .insert(availabilities)
            .values(input)
            .onConflictDoUpdate({
              target: [availabilities.date, availabilities.attendeeId],
              set: { status: input.status },
            }),
      ),
  }),
});

export type AppRouter = typeof appRouter;

const createCaller = t.createCallerFactory(appRouter);

export const serverClient = createCaller({
  links: [
    httpBatchLink({
      url: getApiUrl(),
    }),
  ],
});
