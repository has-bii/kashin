import { getSessionCookie } from "better-auth/cookies"
import { NextRequest, NextResponse } from "next/server"

const AUTH_PATH = "/auth"

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: process.env.COOKIE_PREFIX,
  })

  // Check if path is auth
  if (path.startsWith(AUTH_PATH) && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*"],
}
