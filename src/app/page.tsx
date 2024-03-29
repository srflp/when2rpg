"use client";
import { useTransition } from "react";
import { trpc } from "./_trpc/client";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isPending, mutateAsync } = trpc.poll.create.useMutation();
  const router = useRouter();
  const [isPendingTransition, startTransition] = useTransition();
  const isLoading = isPending || isPendingTransition;
  return (
    <main className="flex flex-col items-center justify-center gap-10 py-12 md:p-12 h-full max-w-screen-md mx-auto px-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="logo" width="340" />
      <div className="flex flex-col gap-5 text-pretty">
        <p>
          When2RPG jest prostym narzędziem pozwalającym na asynchroniczne
          umawianie spotkań dla osób których dostępność zmienia się w czasie.
        </p>
        <p>
          Został stworzony z myślą o graczach papierowych RPG i dostosowany do
          ich potrzeb, lecz świetnie nada się również dla innych grup.
          Organizacja kół naukowych i spotkań z przyjaciółmi nigdy nie była tak
          łatwa!
        </p>
        <p>
          Aby stworzyć nową ankietę, kliknij przycisk poniżej. Znajdziesz się na
          nowej stronie, wystarczy że wyślesz link na czacie twojej grupy i
          gotowe.
        </p>
        <p>
          Teraz każdy może wpisać swoje imię i dostępność przez następne 30 dni.
          Dogodne terminy są łatwo widoczne w sekcji podsumowującej.
        </p>
        <p>
          Żeby korzystać z when2RPG nie potrzebujesz konta i haseł, a cały
          proces trwa zaledwie kilka sekund. Zacznij umawiać się łatwiej już
          dziś!
        </p>
      </div>
      <button
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8 bg-amber-700 text-white"
        onClick={async () => {
          await mutateAsync(undefined, {
            onSuccess: (slug) => {
              startTransition(() => router.push(slug));
            },
          });
        }}
        disabled={isLoading}
      >
        {isLoading && (
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
        {isLoading ? "Tworzenie..." : "Stwórz ankietę"}
      </button>
    </main>
  );
}
