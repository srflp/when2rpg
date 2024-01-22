import { serverClient } from "../_trpc/serverClient";
import { Poll } from "./_components/Poll";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const poll = await serverClient.poll.get({ slug });
  return <Poll slug={slug} initialPoll={poll} />;
}
