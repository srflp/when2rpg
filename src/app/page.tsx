"use client";
import { trpc } from "./_trpc/client";
import { useRouter } from "next/navigation";

export default function Home() {
  const createPoll = trpc.createPoll.useMutation();
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center gap-10 py-12 md:p-12 h-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="logo" width="340" />
      <button
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8 bg-amber-700 text-white"
        onClick={async () => {
          const pollId = await createPoll.mutateAsync();
          if (pollId === null) return;
          router.push(pollId);
        }}
        disabled={createPoll.isPending}
      >
        {createPoll.isPending && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 animate-spin mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        )}
        {createPoll.isPending ? "Tworzenie..." : "Stwórz ankietę"}
      </button>
    </main>
  );
}
