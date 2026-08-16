import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-wedding-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-wedding-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wedding Website | WebSerbisyo",
  description: "Custom Wedding Template — Sage Estate: The Glasshouse Ledger",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={process.env.NODE_ENV === "development"}>
      <body
        className={`${playfair.variable} ${manrope.variable} bg-[var(--wedding-bg)] text-[var(--wedding-text)] antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
