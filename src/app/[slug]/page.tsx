"use client";
import { trpc } from "../_trpc/client";
import { addDays, format, setDefaultOptions } from "date-fns";

import { Meta } from "./_components/Meta";
import { NewAttendee } from "./_components/NewAttendee";
import { AttendeeHeader } from "./_components/AttendeeHeader";
import { AvailabilityIcon } from "./_components/AvailabilityIcon";
import { pl } from "date-fns/locale";
setDefaultOptions({ locale: pl });

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { data: poll } = trpc.getPoll.useQuery({ slug });
  const { data: attendees } = trpc.attendee.list.useQuery(
    { pollId: poll?.id! },
    { enabled: !!poll },
  );

  const today = new Date();
  const next30Days = Array.from({ length: 30 }, (v, i) => {
    const date = addDays(today, i);
    return {
      date: format(date, "dd.MM.yyyy"),
      weekday: format(date, "EEEE"),
    };
  });
  return (
    <main className="flex flex-col justify-between p-6 md:p-12 max-w-screen-2xl mx-auto gap-8 items-start">
      <div className="flex justify-center w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="logo" width="340" className="pb-4" />
      </div>
      {poll && <Meta poll={poll} />}
      <table>
        <thead>
          <tr className="*:px-1">
            <th className="align-bottom">Data</th>
            {attendees?.map((attendee) => (
              <th key={attendee.id} className="align-bottom">
                <AttendeeHeader attendee={attendee} />
              </th>
            ))}
            <th className="align-center">
              {poll && <NewAttendee pollId={poll.id} />}
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {next30Days.map(({ date, weekday }) => (
            <tr key={date}>
              <td>
                {weekday}
                <br />
                {date}
              </td>
              {attendees?.map((attendee) => (
                <td key={attendee.id}>
                  <AvailabilityIcon status={null} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
