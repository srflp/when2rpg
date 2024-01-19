import { db } from "@/db";
import { procedure, router } from "./trpc";
import { polls } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

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
  createPoll: procedure.mutation(async () => {
    const [poll] = await db
      .insert(polls)
      .values({})
      .returning({ slug: polls.slug });
    return poll.slug;
  }),
});

export type AppRouter = typeof appRouter;
