import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Oswald, Archivo_Black, Rubik, Caveat } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Analytics } from "@/components/Analytics";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Oswald: condensed poster face with full Cyrillic (Archivo Black had none, so
// Russian headings fell back to Impact and clipped). Load 700 only; CSS rules
// that request font-weight:400 resolve to the single heavy face.
const display = Oswald({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["700"],
});

// Archivo Black — kept only for the always-English hero headline
// ("From idea to result"), where the original heavy grotesque look matters.
const heroDisplay = Archivo_Black({
  variable: "--font-hero",
  subsets: ["latin"],
  weight: ["400"],
});

// Rubik — brand Hebrew face (client-supplied). Oswald has no Hebrew glyphs, so
// Hebrew headings cascade to this via the --font-hebrew stack.
const hebrewDisplay = Rubik({
  variable: "--font-hebrew",
  subsets: ["hebrew"],
  weight: ["800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dcprod.agency"),
  // No template: every page's title is authored whole in the CMS and already ends
  // with the brand, per the SEO spec. A "%s | dc.prod" template appended a second
  // brand ("… | DC Project | dc.prod") and pushed titles past the SERP cut-off.
  title: "DC Project, Digital Marketing Agency in Israel | SMM, Ads & Content",
  description:
    "dc.prod is a full-cycle production studio: promotional & image videos, 3D animation, social media content, AI content and digital marketing — from idea to result.",
  applicationName: "dc.prod",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = locale === "he" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${heroDisplay.variable} ${hebrewDisplay.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        {/* Warm up the connection to the image CDN used by portfolio/case media */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <Analytics />
          {children}
          {/* Accessibility widget (UserWay) — loaded lazily */}
          <Script
            src="https://cdn.userway.org/widget.js"
            data-account={process.env.NEXT_PUBLIC_USERWAY_ACCOUNT ?? "tZFa3D3tvc"}
            data-position="5"
            data-size="small"
            data-language={locale === "he" ? "he" : locale === "ru" ? "ru" : "en"}
            data-color="#e8a868"
            data-type="1"
            data-widget_layout="full"
            data-z-index="10001"
            strategy="lazyOnload"
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
