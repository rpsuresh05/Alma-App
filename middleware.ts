import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip the API routes as they handle their own auth
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.next()
    }

    // Check if the user has a token
    const token = request.cookies.get("token")?.value

    // If no token and not already on the login page, redirect to login
    if (!token && !request.nextUrl.pathname.endsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

