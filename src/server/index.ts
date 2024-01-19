import { db } from "@/db";
import { procedure, router } from "./trpc";
import { polls } from "@/db/schema";

export const appRouter = router({
  getHello: procedure.query(async () => {
    return await db.select().from(polls);
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
