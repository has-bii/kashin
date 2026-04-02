import { getSessionCookie } from "better-auth/cookies"
import { NextRequest, NextResponse } from "next/server"

const AUTH_PATH = "/auth"

const PRIVATE_PATH = "/dashboard"

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: process.env.COOKIE_PREFIX,
  })

  // Check if path is auth
  if (path.startsWith(AUTH_PATH) && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Check if path is dashboard
  if (path.startsWith(PRIVATE_PATH) && !sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*"],
}
