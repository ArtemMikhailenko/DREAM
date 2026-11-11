import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DC Production",
    short_name: "DC Production",
    description: "DC Production (Dream Chase Production) — digital marketing and ad agency: ads, SEO, video, websites and chatbots.",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }, { src: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a09",
    theme_color: "#e8e4d8",
  };
}