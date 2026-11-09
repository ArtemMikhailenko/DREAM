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

  return intlMiddleware(req);
}

export const config = {
  // Run on all pathnames except: api routes, the Payload admin and its REST API,
  // the custom /studio admin, uploaded media, Next internals, and files with a dot
  // (robots.txt, sitemap.xml, images, etc. stay untouched). Without these exclusions
  // the locale router would rewrite e.g. /admin to /en/admin and the panel would 404.
  matcher: ["/((?!api|admin|studio|payload-api|uploads|_next|_vercel|.*\\..*).*)"],
};
