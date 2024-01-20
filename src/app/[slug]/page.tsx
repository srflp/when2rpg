"use client";
import { trpc } from "../_trpc/client";
import { addDays, format } from "date-fns";

import { Meta } from "./_components/Meta";
import { NewAttendee } from "./_components/NewAttendee";
import { Attendee } from "./_components/Attendee";

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
    return format(addDays(today, i), "dd.MM.yyyy");
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
          <tr>
            <th className="text-left">Data</th>
            {attendees?.map((attendee) => (
              <th key={attendee.id}>
                <Attendee attendee={attendee} />
              </th>
            ))}
            <th className="flex gap-1">
              {poll && <NewAttendee pollId={poll.id} />}
            </th>
          </tr>
        </thead>
        <tbody className="flex flex-col gap-4">
          {next30Days.map((day) => (
            <tr key={day}>
              <td className="">{day}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
