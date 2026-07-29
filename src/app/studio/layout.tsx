import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./studio.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Студия — dc.prod",
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
