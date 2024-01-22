"use client";
import { trpc } from "../../_trpc/client";
import { addDays, format, setDefaultOptions } from "date-fns";
import { Meta } from "./Meta";
import { NewAttendee } from "./NewAttendee";
import { AvailabilityIcon } from "./AvailabilityIcon";
import { pl } from "date-fns/locale";
import { Fragment, useEffect, useMemo, useState } from "react";
import { AttendeeDeleteButton } from "./AttendeeDeleteButton";
import { AttendeeName } from "./AttendeeName";
import { cn } from "@/cn";
import { AvailabilityPicker } from "./AvailabilityPicker";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { serverClient } from "@/server/trpc";

setDefaultOptions({ locale: pl });

export function Poll({
  slug,
  initialPoll,
}: {
  slug: string;
  initialPoll: Awaited<ReturnType<(typeof serverClient)["poll"]["get"]>>;
}) {
  const { data: poll } = trpc.poll.get.useQuery(
    { slug },
    {
      initialData: initialPoll,
      refetchOnMount: false,
    },
  );
  const today = new Date();
  const next30Days = Array.from({ length: 30 }, (v, i) => {
    const date = addDays(today, i);
    return {
      date: format(date, "yyyy-MM-dd"),
      dateFormatted: format(date, "dd.MM.yyyy"),
      weekday: format(date, "EEEE"),
    };
  });
  const stats = useMemo(() => {
    const stats: Record<string, Record<string, number>> = {};
    for (const { date } of next30Days) {
      stats[date] = {};
      for (const status of ["yes", "maybe"]) {
        stats[date][status] = 0;
      }
    }
    for (const attendee of poll?.attendees || []) {
      for (const availability of attendee.availabilities) {
        if (availability.status === "no") continue;
        stats[availability.date][availability.status]++;
      }
    }
    return stats;
  }, [poll, next30Days]);
  const [isPollEditMode, setIsPollEditMode] = useState(false);
  useEffect(() => {
    if (poll && poll.attendees.length === 0) setIsPollEditMode(true);
  }, [poll]);

  const [selectedAttendee, setSelectedAttendee] = useState("");

  return (
    <main className="flex flex-col justify-between pt-6 md:pt-12 max-w-screen-2xl mx-auto gap-8 items-start">
      <div className="px-6 w-full">
        <div className="flex justify-center w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="logo" width="340" className="pb-4" />
        </div>
        {poll && <Meta poll={poll} isPollEditMode={isPollEditMode} />}
        <ToggleButtonGroup
          className="pt-6"
          color="primary"
          value={isPollEditMode}
          exclusive
          onChange={(_, value) => {
            if (value !== null) return setIsPollEditMode(value);
          }}
          disabled={poll?.attendees?.length === 0}
        >
          <ToggleButton value={false}>Głosowanie</ToggleButton>
          <ToggleButton value={true}>Edycja</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="w-full">
        <div
          className="grid text-center overflow-x-auto"
          style={{
            gridTemplateColumns: `repeat(${(poll?.attendees.length || 0) + 2}, 1fr)`,
          }}
        >
          <div className="self-end h-full py-2 text-lg row-span-2 font-semibold sticky left-0 bg-white z-10 grid content-end">
            Data
          </div>
          <div className="col-start-2 col-end-[-2] text-lg p-2 font-semibold">
            Dostępność
          </div>
          {!!poll?.attendees.length && <div className="text-lg p-2 font-semibold">
            {isPollEditMode ? "" : "Podsumowanie"}
          </div>}
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
          {poll && isPollEditMode ? (
            <div className="self-end min-w-52 flex p-2">
              <NewAttendee slug={slug} pollId={poll.id} />
            </div>
          ) : (
            <div></div>
          )}
          {next30Days.map(({ date, dateFormatted, weekday }, i) => (
            <Fragment key={date}>
              <div className="px-2 py-1.5 sticky left-0 bg-white z-10">
                {weekday}
                <br />
                {dateFormatted}
              </div>
              {poll?.attendees.map((attendee) => {
                const status = attendee.availabilities.find(
                  (a) => a.date === date,
                )?.status;
                return (
                  <div
                    key={attendee.id}
                    onClick={() =>
                      !isPollEditMode &&
                      setSelectedAttendee((currentId) =>
                        currentId === attendee.id ? "" : attendee.id,
                      )
                    }
                    className={cn(
                      "cursor-pointer flex flex-col justify-center items-center px-3",
                      !isPollEditMode &&
                        selectedAttendee === attendee.id &&
                        "bg-zinc-100",
                      i === 29 && "rounded-b-2xl",
                    )}
                  >
                    {selectedAttendee === attendee.id && !isPollEditMode ? (
                      <AvailabilityPicker
                        slug={slug}
                        attendeeId={attendee.id}
                        date={date}
                        status={status}
                      />
                    ) : (
                      <AvailabilityIcon status={status} active />
                    )}
                  </div>
                );
              })}
              {isPollEditMode ? (
                <div></div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  {!!stats[date]["yes"] && (
                    <span>
                      {stats[date]["yes"]}
                      {"x "}
                      <AvailabilityIcon status="yes" active />
                    </span>
                  )}
                  {!!stats[date]["maybe"] && (
                    <span>
                      {stats[date]["maybe"]}
                      {"x "}
                      <AvailabilityIcon status="maybe" active />
                    </span>
                  )}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </main>
  );
}
