"use client";
import { trpc } from "../_trpc/client";
import { addDays, format, setDefaultOptions } from "date-fns";

import { Meta } from "./_components/Meta";
import { NewAttendee } from "./_components/NewAttendee";
import { AvailabilityIcon } from "./_components/AvailabilityIcon";
import { pl } from "date-fns/locale";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Fragment, useEffect, useState } from "react";
import { AttendeeDeleteButton } from "./_components/AttendeeDeleteButton";
import { AttendeeName } from "./_components/AttendeeName";
import { cn } from "@/cn";
import { AvailabilityPicker } from "./_components/AvailabilityPicker.1";

setDefaultOptions({ locale: pl });

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { data: poll } = trpc.poll.get.useQuery({ slug });
  console.log(poll);

  const today = new Date();
  const next30Days = Array.from({ length: 30 }, (v, i) => {
    const date = addDays(today, i);
    return {
      date: format(date, "dd.MM.yyyy"),
      weekday: format(date, "EEEE"),
    };
  });
  const [isPollEditMode, setIsPollEditMode] = useState(false);
  useEffect(() => {
    if (poll && poll.attendees.length === 0) setIsPollEditMode(true);
  }, [poll]);

  const [selectedAttendee, setSelectedAttendee] = useState("");

  return (
    <main className="flex flex-col justify-between p-6 md:p-12 max-w-screen-2xl mx-auto gap-8 items-start">
      <div className="flex justify-center w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="logo" width="340" className="pb-4" />
      </div>
      {poll && <Meta poll={poll} isPollEditMode={isPollEditMode} />}
      <FormControlLabel
        checked={isPollEditMode}
        control={
          <Switch
            size="small"
            onChange={(e) => setIsPollEditMode(e.target.checked)}
          />
        }
        label="Tryb zarządzania ankietą"
        disabled={poll?.attendees?.length === 0}
      />

      <div className="overflow-x-auto w-full">
        <div
          className="grid text-center"
          style={{
            gridTemplateColumns: `repeat(${(poll?.attendees.length || 0) + 1 + +isPollEditMode}, minmax(min-content,1fr))`,
          }}
        >
          <div className="self-end py-2 text-lg row-span-2 font-semibold">
            Data
          </div>
          <div className="col-start-2 col-end-[-1] text-lg p-2 font-semibold">
            Dostępność
          </div>
          {poll?.attendees.map((attendee) => (
            <div
              key={attendee.id}
              className={cn(
                "h-full flex flex-col items-center justify-between cursor-pointer py-2 px-5 rounded-t-2xl leading-7",
                !isPollEditMode &&
                  selectedAttendee === attendee.id &&
                  "bg-zinc-100",
              )}
              onClick={() =>
                !isPollEditMode &&
                setSelectedAttendee((currentId) =>
                  currentId === attendee.id ? "" : attendee.id,
                )
              }
            >
              <div className="flex gap-2">
                {isPollEditMode && (
                  <AttendeeDeleteButton
                    slug={slug}
                    attendeeId={attendee.id}
                    attendeeName={attendee.name}
                  />
                )}
              </div>
              <AttendeeName
                slug={slug}
                attendeeId={attendee.id}
                attendeeName={attendee.name}
                isPollEditMode={isPollEditMode}
              />
            </div>
          ))}
          {poll && isPollEditMode && (
            <div className="self-end min-w-52 flex p-2">
              <NewAttendee slug={slug} pollId={poll.id} />
            </div>
          )}
          {next30Days.map(({ date, weekday }, i) => (
            <Fragment key={date}>
              <div className="px-2 py-1.5">
                {weekday}
                <br />
                {date}
              </div>
              {poll?.attendees.map((attendee) => (
                <div
                  key={attendee.id}
                  onClick={() =>
                    !isPollEditMode &&
                    setSelectedAttendee((currentId) =>
                      currentId === attendee.id ? "" : attendee.id,
                    )
                  }
                  className={cn(
                    "cursor-pointer flex flex-col justify-center items-center",
                    !isPollEditMode &&
                      selectedAttendee === attendee.id &&
                      "bg-zinc-100",
                    i === 29 && "rounded-b-2xl",
                  )}
                >
                  {selectedAttendee === attendee.id ? (
                    <AvailabilityPicker />
                  ) : (
                    <AvailabilityIcon status="yes" />
                  )}
                </div>
              ))}
              {poll && isPollEditMode && <div></div>}
            </Fragment>
          ))}
        </div>
      </div>
    </main>
  );
}
