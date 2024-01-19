import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(env.CONNECTION_STRING, { prepare: false });
export const db = drizzle(client);
