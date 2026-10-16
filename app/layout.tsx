import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhoneHub — Daftar HP Terbaru per Brand",
  description: "Jelajahi handphone terbaru dari Samsung, Apple, Xiaomi, OPPO, dan vivo.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]/80 pt-[env(safe-area-inset-top)] backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
                📱
              </span>
              PhoneHub
            </Link>
            <span className="text-muted hidden text-xs sm:inline">Data: Phone Specs API (open source)</span>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-12 sm:pb-16">{children}</main>
        <footer className="text-muted border-t border-[var(--line)] px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-xs">
          Data dari{" "}
          <a className="underline" href="https://github.com/azharimm/phone-specs-api" target="_blank" rel="noreferrer">
            azharimm/phone-specs-api
          </a>{" "}
          · dibuat dengan Next.js
        </footer>
      </body>
    </html>
  );
}
