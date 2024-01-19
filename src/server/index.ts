import { publicProcedure, router } from "./trpc";

import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { polls } from "@/db/schema";
import { z } from "zod";

const client = postgres(env.CONNECTION_STRING, { prepare: false });
const db = drizzle(client);

migrate(db, { migrationsFolder: "drizzle" });

export const appRouter = router({
  getHello: publicProcedure.query(async () => {
    return await db.select().from(polls);
  }),
  createPoll: publicProcedure.mutation(async () => {
    const [poll] = await db
      .insert(polls)
      .values({})
      .returning({ slug: polls.slug });
    return poll.slug;
  }),
});

export type AppRouter = typeof appRouter;
