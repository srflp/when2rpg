ALTER TABLE "availabilities" RENAME COLUMN "user_id" TO "attendee_id";--> statement-breakpoint
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_poll_id_polls_id_fk";
--> statement-breakpoint
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_user_id_attendees_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_attendee_id_attendees_id_fk" FOREIGN KEY ("attendee_id") REFERENCES "attendees"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "availabilities" DROP COLUMN IF EXISTS "poll_id";