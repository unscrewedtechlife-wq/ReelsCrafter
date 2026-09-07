import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Viewmax — AI Video Studio",
  description:
    "Self-hosted AI content creation platform. Generate TikTok ads, UGC, Shorts, and brand videos from a single prompt.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
