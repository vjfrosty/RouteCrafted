import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "RouteCrafted — AI Travel Itinerary Builder",
  description:
    "AI-powered day-by-day travel plans with weather-aware replanning and Worth It / Skip It place cards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-surface text-on-surface">
        <Header />
        <main className="pt-16 pb-20 md:pb-0">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
