ALTER TYPE "status" ADD VALUE 'maybe';--> statement-breakpoint
ALTER TABLE "attendees" DROP CONSTRAINT "attendees_poll_id_polls_id_fk";
--> statement-breakpoint
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_poll_id_polls_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendees" ADD CONSTRAINT "attendees_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
