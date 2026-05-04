import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dream.agency"),
  title: {
    default: "DREAM — Video, Ads & SMM for inbound leads",
    template: "%s | DREAM",
  },
  description:
    "DREAM helps businesses get inbound leads from ads and search: video production, performance advertising, SMM, cases, packages and fast launch.",
  applicationName: "DREAM",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "video production for business",
    "performance advertising",
    "SMM agency",
    "lead generation",
    "content marketing",
    "DREAM",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "DREAM",
    title: "DREAM — Video, Ads & SMM for inbound leads",
    description:
      "DREAM agency: portfolio, cases, packages and a contact form for businesses that need clients.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DREAM — Video, Ads & SMM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DREAM — Video, Ads & SMM for inbound leads",
    description:
      "Fast, SEO-ready landing page for leads from ads and organic search.",
    images: ["/opengraph-image"],
  },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
