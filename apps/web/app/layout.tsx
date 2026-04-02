import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
