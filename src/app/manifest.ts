import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DREAM",
    short_name: "DREAM",
    description: "Видео, реклама и SMM для заявок бизнеса.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#111111",
  };
}