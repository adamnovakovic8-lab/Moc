import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import "./chrome.css";
import "./sequence.css";
import { Masthead } from "@/components/chrome/masthead";
import { Opening } from "@/components/chrome/opening";
import { KlinovaMark } from "@/components/brand/klinova";
import { StatusRail } from "@/components/chrome/status-rail";
import { RevealEngine } from "@/components/primitives/reveal-engine";
import { company, trust } from "@/lib/klinova";
import { sheets } from "@/lib/sheets";

/* Archivo carries the oversized voice; Plex Mono is the annotation layer. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Klinova — Software that fits your business",
    template: "%s — Klinova",
  },
  description:
    "Klinova is a Canadian software company. Six proprietary platforms, engineered entirely in-house — secure, scalable and shaped to your workflow.",
  metadataBase: new URL("https://klinova.ca"),
  openGraph: {
    title: "Klinova — Software that fits your business",
    description:
      "Six proprietary platforms, engineered entirely in-house. No third-party cores, no licensed black boxes.",
    siteName: "Klinova",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-CA"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${plexMono.variable}`}
      /* The opening guard below stamps data-entered on this element before
         React hydrates, which is the point — it has to beat first paint.
         This scopes the expected mismatch to this one element's attributes. */
      suppressHydrationWarning
    >
      <body>
        {/* Runs before first paint so a repeat visit never flashes the
            opening. Synchronous by necessity — an effect would be too late. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var k='klinova:entered';if(sessionStorage.getItem(k)){document.documentElement.dataset.entered='1'}else{sessionStorage.setItem(k,'1')}}catch(e){}",
          }}
        />

        <a className="skip" href="#sheet">
          Skip to content
        </a>

        <Opening />
        <RevealEngine />
        <Masthead />

        <main id="sheet">{children}</main>

        <footer className="colophon">
          <div className="colophon-grid">
            <div className="colophon-block">
              <KlinovaMark className="colophon-mark" title="Klinova" />
              <p className="mono-sm colophon-h">Klinova</p>
              <p className="colophon-line">
                A Canadian software company. Every platform written, secured
                and supported by our own team.
              </p>
              <p className="colophon-line">
                <a href={`mailto:${company.email}`} className="draw">
                  {company.email}
                </a>
              </p>
              <p className="colophon-line">
                <a href={`mailto:${company.careersEmail}`} className="draw">
                  {company.careersEmail}
                </a>
              </p>
            </div>

            <div className="colophon-block">
              <p className="mono-sm colophon-h">Sheets</p>
              <ul className="colophon-list">
                {sheets.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="draw">
                      <span className="mono-sm">{s.n}</span> {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="colophon-block">
              <p className="mono-sm colophon-h">Baseline</p>
              <ul className="colophon-list">
                {trust.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="colophon-block">
              <p className="mono-sm colophon-h">Studios</p>
              <ul className="colophon-list">
                {company.studios.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="colophon-foot mono-sm">
            © {new Date().getFullYear()} {company.legal} — built in Canada
          </p>
        </footer>

        <StatusRail />

        {/* Paper grain. Keeps large flat areas from reading as flat vector. */}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
