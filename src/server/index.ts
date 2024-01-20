import { db } from "@/db";
import { procedure, router } from "./trpc";
import { polls } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

const insertPollSchema = createInsertSchema(polls);
const selectPollSchema = createSelectSchema(polls);
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
});

export type AppRouter = typeof appRouter;
