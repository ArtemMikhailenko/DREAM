import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // One canonical host: www.dreamchaseprod.com → dreamchaseprod.com (301).
  const host = req.headers.get("host") || "";
  if (host.startsWith("www.")) {
    return NextResponse.redirect(`https://${host.slice(4)}${pathname}${req.nextUrl.search}`, 301);
  }

  // English lives at the root: /en/... (what the language switcher links to) and the
  // legacy /eng/... both land on the same path without the prefix (301).
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    return NextResponse.redirect(url, 301);
  }
  if (pathname === "/eng" || pathname.startsWith("/eng/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/eng/, "") || "/";
    return NextResponse.redirect(url, 301);
  }

  // Home page "/" (English) sends visitors to their language: the one they picked in
  // the switcher (dc_lang cookie), or else their browser's (Spanish → /es, Russian →
  // /ru, Hebrew → /heb, Arabic → /ar). Never for search bots, so the English root stays the page
  // Google indexes. (The cookie also covers Chrome's client-hint retry of the request.)
  if (pathname === "/") {
    const ua = req.headers.get("user-agent") || "";
    if (!/bot|crawl|spider|slurp|facebookexternalhit|lighthouse|preview/i.test(ua)) {
      const saved = req.cookies.get("dc_lang")?.value;
      const first = (req.headers.get("accept-language") || "").split(",")[0].trim().toLowerCase();
      const pref = saved ?? (first.startsWith("ar") ? "ar" : first.startsWith("es") ? "es" : first.startsWith("ru") ? "ru" : first.startsWith("he") || first.startsWith("iw") ? "he" : "en");
      const to = pref === "ar" ? "/ar" : pref === "es" ? "/es" : pref === "ru" ? "/ru" : pref === "he" ? "/heb" : "";
      if (to) {
        const url = req.nextUrl.clone();
        url.pathname = to;
        const res = NextResponse.redirect(url, 307);
        res.headers.set("Cache-Control", "private, no-store");
        res.headers.set("Vary", "Accept-Language, Cookie");
        if (!saved) res.cookies.set("dc_lang", pref, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
        return res;
      }
    }
  }

  return intlMiddleware(req);
}

export const config = {
  // Run on all pathnames except: api routes, the Payload admin and its REST API,
  // the custom /studio admin, uploaded media, Next internals, and files with a dot
  // (robots.txt, sitemap.xml, images, etc. stay untouched). Without these exclusions
  // the locale router would rewrite e.g. /admin to /en/admin and the panel would 404.
  matcher: ["/((?!api|admin|studio|payload-api|uploads|_next|_vercel|.*\\..*).*)"],
};
