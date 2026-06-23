import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { EventCacheProvider } from "@/context/EventCacheContext";
import { ApiWarmup } from "@/components/ApiWarmup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Event Management | ConferenceTV",
  description:
    "Create and manage conference events with speaker details, AI-generated content, and PDF export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <EventCacheProvider>
          <ApiWarmup />
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        </EventCacheProvider>
      </body>
    </html>
  );
}
