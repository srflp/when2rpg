ALTER TABLE "polls_attendees" RENAME TO "attendees";--> statement-breakpoint
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_user_id_polls_attendees_id_fk";
--> statement-breakpoint
ALTER TABLE "attendees" DROP CONSTRAINT "polls_attendees_poll_id_polls_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_user_id_attendees_id_fk" FOREIGN KEY ("user_id") REFERENCES "attendees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendees" ADD CONSTRAINT "attendees_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
