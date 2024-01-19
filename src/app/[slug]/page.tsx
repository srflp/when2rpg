"use client";

import { trpc } from "../_trpc/client";
import { addDays, format } from "date-fns";

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
    <main className="flex flex-col justify-between p-24">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="logo" width="340" />
      <h1 className="text-2xl font-semibold">{poll?.name || "Bez nazwy"}</h1>
      <p>{poll?.description}</p>
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
