import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIAI CRM — AI Multi-Channel Lead Intelligence",
  description: "Intelligent CRM system with native Bangla, Banglish, and English message triage and response generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className="h-full overflow-hidden bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 antialiased">
        {children}
      </body>
    </html>
  );
}
