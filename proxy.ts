import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for host-based routing in StoreCrafts
 * Detects the request host and rewrites to appropriate route group:
 * - admin.storecrafts.com → (superadmin)
 * - [storename].admin.storecrafts.com → (storeadmin)/[storename]
 * - storecrafts.com/[storename]/... → (storefront)/[storename]/...
 * - storecrafts.com → (marketing)
 */

export async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Local development handling
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");

  // Extract port if present
  const hostWithoutPort = hostname.split(":")[0];

  // Check for super admin subdomain
  if (hostWithoutPort === "admin.storecrafts.com" || hostWithoutPort === "admin.localhost") {
    if (!pathname.startsWith("/superadmin")) {
      return NextResponse.rewrite(new URL(`/superadmin${pathname}`, request.url));
    }
    return NextResponse.next();
  }

  // Check for store admin subdomain
  const storeAdminMatch = hostWithoutPort.match(
    /^([a-z0-9][a-z0-9-]*?)\.admin\.(storecrafts\.com|localhost)$/i
  );
  if (storeAdminMatch) {
    const storename = storeAdminMatch[1];
    if (!pathname.startsWith("/storeadmin")) {
      return NextResponse.rewrite(
        new URL(`/storeadmin/${storename}${pathname}`, request.url)
      );
    }
    return NextResponse.next();
  }

  // Local dev query params
  if (isLocalhost) {
    const adminParam = request.nextUrl.searchParams.get("admin");
    if (adminParam) {
      const url = request.nextUrl.clone();
      url.pathname = `/storeadmin/${adminParam}`;
      url.searchParams.delete("admin");
      return NextResponse.rewrite(url);
    }

    const superadminParam = request.nextUrl.searchParams.get("superadmin");
    if (superadminParam === "true") {
      const url = request.nextUrl.clone();
      url.pathname = `/superadmin${url.pathname}`;
      url.searchParams.delete("superadmin");
      return NextResponse.rewrite(url);
    }
  }

  // Root no rewrite needed for marketing
  if (pathname === "/" || pathname === "") {
    return NextResponse.next();
  }

  // Detect storefront first segment as store path
  if (!pathname.startsWith("/storefront") && !pathname.startsWith("/superadmin") &&
      !pathname.startsWith("/storeadmin") && !pathname.startsWith("/auth") &&
      !pathname.startsWith("/api") && !pathname.startsWith("/health")) {

    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length > 0) {
      const potentialStorename = pathSegments[0];
      const reservedRoutes = ["admin", "superadmin", "storeadmin", "storefront", "cart", "checkout", "login", "forgot-password", "api", "health"];
      if (!reservedRoutes.includes(potentialStorename)) {
        const remainingPath = pathname.substring(potentialStorename.length + 1);
        return NextResponse.rewrite(
          new URL(`/storefront/${potentialStorename}${remainingPath ? "/" + remainingPath : "/"}`, request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

/**

/**
 * Configuration for which routes run through the middleware
 * Exclude static assets, public files, and Next.js internals
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public directory)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|public).*)",
  ],
};
