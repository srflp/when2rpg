export default function Page({
  params: { poolId },
}: {
  params: { poolId: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl">when2rpg - pool (id: {poolId})</h1>
    </main>
  );
}
