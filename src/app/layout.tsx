import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue, Caveat } from "next/font/google";
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

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dcprod.agency"),
  title: {
    default: "dc.prod — From idea to result. Video, ads & SMM",
    template: "%s | dc.prod",
  },
  description:
    "dc.prod is a full-cycle production studio: promotional & image videos, 3D animation, social media content, AI content and digital marketing — from idea to result.",
  applicationName: "dc.prod",
  alternates: { canonical: "/" },
  keywords: [
    "video production",
    "promotional videos",
    "image videos",
    "3d animation",
    "social media content",
    "ai content",
    "digital marketing",
    "dc.prod",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "dc.prod",
    title: "dc.prod — From idea to result",
    description:
      "Full-cycle production studio: video, ads, SMM and digital marketing for brands that want a result.",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "dc.prod — From idea to result" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "dc.prod — From idea to result",
    description:
      "Full-cycle production studio: video, ads, SMM and digital marketing.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${bebas.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
