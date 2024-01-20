"use client";
import { trpc } from "../_trpc/client";
import { addDays, format } from "date-fns";

import { Meta } from "../_components/Meta";

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { data: poll } = trpc.getPoll.useQuery({ slug });

  const today = new Date();
  const next30Days = Array.from({ length: 30 }, (v, i) => {
    return format(addDays(today, i), "dd.MM.yyyy");
  });
  return (
    <main className="flex flex-col justify-between p-6 md:p-12 max-w-screen-2xl mx-auto gap-8">
      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="logo" width="340" className="pb-4" />
      </div>
      {poll && <Meta poll={poll} />}
      <table>
        <tbody className="flex flex-col gap-4">
          {next30Days.map((day) => {
            return (
              <tr key={day}>
                <div className="">{day}</div>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
