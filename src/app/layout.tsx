import type { Metadata } from "next";
import { Noto_Sans_Devanagari, Noto_Sans_Telugu } from "next/font/google";
import "./globals.css";

const telugu = Noto_Sans_Telugu({ subsets: ["telugu"], variable: "--font-telugu", display: "swap" });
const devanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-devanagari", display: "swap" });

export const metadata: Metadata = {
  title: "Roll Rescue — Check your voter list status",
  description: "Check for a possible voter-list match and learn what to do next.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${telugu.variable} ${devanagari.variable}`}>
    <header className="site-header"><div className="header-inner">
      <a className="brand" href="/">roll<span className="brand-mark">rescue</span></a>
      <nav className="nav-links" aria-label="Main navigation"><a href="/check">Check my name</a><a href="/guide">What to do next</a></nav>
    </div></header>
    <main>{children}</main>
    <footer className="footer"><div className="page-shell">Possible matches only. Please confirm with your Booth Level Officer (BLO).</div></footer>
  </body></html>;
}
