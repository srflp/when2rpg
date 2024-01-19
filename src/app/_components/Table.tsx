"use client";

import { trpc } from "../_trpc/client";

export default function Table() {
  const getHello = trpc.getHello.useQuery();
  return (
    <div>
      <h1>Table</h1>
      <p>{JSON.stringify(getHello.data, null, 2)}</p>
    </div>
  );
}
