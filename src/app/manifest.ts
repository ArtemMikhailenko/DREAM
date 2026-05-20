import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "dc.prod",
    short_name: "dc.prod",
    description: "dc.prod — from idea to result. Video, ads, SMM and digital marketing.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a09",
    theme_color: "#e8e4d8",
  };
}