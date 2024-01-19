import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/cn";
import Provider from "./_trpc/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "when2rpg",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "max-w-screen-xl mx-auto px-12 py-10")}
      >
        <Provider>
          <h1 className="font-semibold text-2xl">when2rpg</h1>
          <p>Tutaj opis</p>
          {children}
        </Provider>
      </body>
    </html>
  );
}
