import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-event-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-event-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Event Website | WebSerbisyo",
  description: "Custom Event Template — Sage Estate: The Glasshouse Ledger",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={process.env.NODE_ENV === "development"}>
      <body
        className={`${playfair.variable} ${manrope.variable} bg-[var(--event-bg)] text-[var(--event-text)] antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
