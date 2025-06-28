import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const url = req.nextUrl;
  const pathname = url.pathname;

  const hasAccess = !!accessToken;
  const hasRefresh = !!refreshToken;

  // if (pathname === "/admin/login" && hasAccess && hasRefresh) {
  //   return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  // }

  // if (pathname === "/admin/login") {
  //   return NextResponse.next();
  // }

  // if (pathname.startsWith("/admin/") && !hasAccess && hasRefresh) {
  //   return NextResponse.next();
  // }

  // if (pathname.startsWith("/admin/") && !hasAccess && !hasRefresh) {
  //   return NextResponse.redirect(new URL("/admin/login", req.url));
  // }

  const publicRoutes = ["/login", "/signup", "/forgot"];
  if (req.method === "GET" && publicRoutes.includes(pathname) && hasAccess) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname === "/profile" && !hasAccess && !hasRefresh) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/forgot", "/profile", "/admin/:path*"],
};
