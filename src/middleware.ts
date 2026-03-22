import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value || "";

  const pathLower = path.toLowerCase();
  const publicPaths = ["/", "/login", "/signup", "/verifyemail"];
  const isPublicPath = publicPaths.includes(pathLower);

  // Landing "/" is public; if user has token and hits "/" send to dashboard
  if (path === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Protected path without token -> Login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/Login", req.nextUrl));
  }

  // Public auth pages with token -> dashboard
  if (["/login", "/signup", "/verifyemail"].includes(pathLower) && token) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}