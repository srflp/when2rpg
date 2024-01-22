import { serverClient } from "@/server/trpc";
import { Poll } from "./_components/Poll";
import { redirect } from "next/navigation";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const poll = await serverClient.poll.get({ slug });
  if (!poll) return redirect("/");
  return <Poll slug={slug} initialPoll={poll} />;
}
