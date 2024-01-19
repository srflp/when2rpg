"use client";

import { useState } from "react";
import { trpc } from "../_trpc/client";
import { addDays, format } from "date-fns";

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { data: poll } = trpc.getPoll.useQuery({ slug });
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const today = new Date();
  const next30Days = Array.from({ length: 30 }, (v, i) => {
    return format(addDays(today, i), "dd.MM.yyyy");
  });
  return (
    <main className="flex flex-col justify-between p-24">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="logo" width="340" />
      {isEditingMeta ? (
        <div>editing</div>
      ) : (
        <div>
          <h1 className="text-2xl font-semibold">
            {poll?.name || "Bez nazwy"}
          </h1>
          <p>{poll?.description}</p>
        </div>
      )}

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
