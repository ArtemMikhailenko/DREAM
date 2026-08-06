import { NextRequest, NextResponse } from "next/server";

// The English site lives at the root (no prefix). /eng/* is a legacy/defensive
// path that must never index as a duplicate English version — 301 it to the same
// path at the root. /ru and /heb stay as-is (real localized versions).
// robots.ts also disallows /eng/, but the redirect is what collapses any inbound
// /eng link onto the canonical URL. Scoped by `matcher` to /eng only, so it never
// interferes with next-intl's [locale] routing.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/eng" || pathname.startsWith("/eng/")) {
    const stripped = pathname.replace(/^\/eng/, "") || "/";
    const url = req.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/eng", "/eng/:path*"],
};
