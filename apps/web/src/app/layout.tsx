import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Viewmax — AI Video Studio",
    template: "%s | Viewmax",
  },
  description:
    "The self-hosted AI content creation platform. Generate professional TikTok ads, YouTube Shorts, UGC creatives, and cinematic brand videos — fully automated.",
  keywords: ["AI video", "TikTok ads", "UGC content", "AI creative studio", "video generator"],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Viewmax — AI Video Studio",
    description: "Self-hosted AI-powered video creation platform.",
    siteName: "Viewmax",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#09090b] text-[#f4f4f5]">{children}</body>
    </html>
  );
}
