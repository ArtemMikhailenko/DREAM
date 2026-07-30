import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dreamchaseprod.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /api/ — служебный эндпоинт приёма заявок; /eng/ — путь-редирект на корень
        // (закрыт, чтобы не плодить дубли английской версии)
        disallow: ["/api/", "/eng/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
