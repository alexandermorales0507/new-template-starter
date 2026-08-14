import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedding Website | WebSerbisyo",
  description: "Custom Wedding Template Starter",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={process.env.NODE_ENV === "development"}>
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
