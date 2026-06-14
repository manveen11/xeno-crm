import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from 'sonner';
import "./globals.css";

export const metadata: Metadata = {
  title: "Xeno CRM — Chat-first AI campaigns for D2C",
  description:
    "Tell Xeno what you need in plain English. The AI segments your customers, drafts personalized copy, and fires campaigns across WhatsApp, SMS, Email and RCS.",
  authors: [{ name: "Manveen" }],
  creator: "Manveen",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head suppressHydrationWarning>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;family=Inter:wght@400;500;600;700&amp;family=Space+Mono&amp;display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        {/* Built by Manveen - Xeno CRM Hackathon */}
        <div className="fixed bottom-0 left-0 p-1 text-[7px] text-ink/5 pointer-events-none select-none z-[9999]" aria-hidden="true">
          Built by Manveen
        </div>
        <AuthProvider>
          <Toaster position="bottom-right" richColors />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
