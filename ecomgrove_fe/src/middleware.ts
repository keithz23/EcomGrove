import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const url = req.nextUrl;
  const pathname = url.pathname;

  const isAuthenticated = !!accessToken;
  const hasRefresh = !!refreshToken;

  // ===== ADMIN ROUTES =====
  if (pathname === "/admin/login") {
    if (isAuthenticated && hasRefresh) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/")) {
    if (!isAuthenticated && !hasRefresh) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // ===== PUBLIC ROUTES =====
  const publicRoutes = ["/login", "/signup", "/forgot"];
  if (req.method === "GET" && publicRoutes.includes(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // ===== PROFILE (Protected User Route) =====
  if (pathname === "/profile") {
    if (!isAuthenticated && !hasRefresh) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // ===== DEFAULT =====
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/forgot", "/profile", "/admin/:path*"],
};
