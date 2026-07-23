import type { Metadata } from "next";
import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./lib/query-provider";
import { Sidebar } from "./components/layout/sidebar";
import { Topbar } from "./components/layout/topbar";
import { PlayerBar } from "./components/layout/player-bar";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display-src",
  weight: ["500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body-src",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-src",
  weight: ["400", "500"],
  // Only used for track durations/timestamps, which render after the
  // Deezer fetch resolves — not at first paint. Preloading it eagerly
  // just sits unused for a couple seconds and triggers a console warning.
  preload: false,
});

export const metadata: Metadata = {
  title: "Wavelength — a Spotify-style player",
  description:
    "A frontend-only music player built on the Deezer catalog, with 30-second previews.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme class before first paint, so there's
            no flash of the wrong theme. suppressHydrationWarning above is
            required because of this: it runs before React hydrates and
            appends a class React's own render didn't know about, which
            would otherwise be flagged as a mismatch on <html> specifically. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('wavelength-theme');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-body h-screen overflow-hidden bg-base-950">
        <QueryProvider>
          <div className="flex h-full flex-col">
            <div className="flex flex-1 gap-2 overflow-hidden p-2 pb-0">
              <Sidebar />
              <main className="flex-1 overflow-y-auto rounded-xl bg-gradient-to-b from-base-850 to-base-950">
                <Topbar />
                <div className="px-6 pb-8">{children}</div>
              </main>
            </div>
            <PlayerBar />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}