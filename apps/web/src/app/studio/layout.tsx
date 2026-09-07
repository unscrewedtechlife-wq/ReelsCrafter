import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Pipeline Studio",
  description:
    "20-stage autonomous AI video pipeline. Generate professional TikTok ads, YouTube Shorts, and UGC creatives from a single prompt.",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
