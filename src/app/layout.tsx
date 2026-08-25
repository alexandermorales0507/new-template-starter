import type { Metadata } from "next";
import { Bebas_Neue, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-event-display",
  display: "swap",
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-event-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Event Website | WebSerbisyo",
  description: "Custom Event Template — Comic Paper Card Edition",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={process.env.NODE_ENV === "development"}>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} bg-[var(--event-bg)] text-[var(--event-text)] antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
