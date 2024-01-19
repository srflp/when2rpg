ALTER TABLE "pools" RENAME TO "polls";--> statement-breakpoint
ALTER TABLE "pools_attendees" RENAME TO "polls_attendees";--> statement-breakpoint
ALTER TABLE "availabilities" RENAME COLUMN "pool_id" TO "poll_id";--> statement-breakpoint
ALTER TABLE "polls_attendees" RENAME COLUMN "pool_id" TO "poll_id";--> statement-breakpoint
ALTER TABLE "polls" DROP CONSTRAINT "pools_slug_unique";--> statement-breakpoint
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_pool_id_pools_id_fk";
--> statement-breakpoint
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_user_id_pools_attendees_id_fk";
--> statement-breakpoint
ALTER TABLE "polls_attendees" DROP CONSTRAINT "pools_attendees_pool_id_pools_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_user_id_polls_attendees_id_fk" FOREIGN KEY ("user_id") REFERENCES "polls_attendees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polls_attendees" ADD CONSTRAINT "polls_attendees_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "polls" ADD CONSTRAINT "polls_slug_unique" UNIQUE("slug");