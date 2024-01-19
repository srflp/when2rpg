import Table from "../_components/Table";

export default function Page({
  params: { pollId },
}: {
  params: { pollId: string };
}) {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-2xl">when2rpg - pool (id: {pollId})</h1>
      <Table />
    </main>
  );
}
