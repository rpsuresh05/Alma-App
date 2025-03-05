import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("auth-token")?.value

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Prevent authenticated users from accessing login page
  if (request.nextUrl.pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}

