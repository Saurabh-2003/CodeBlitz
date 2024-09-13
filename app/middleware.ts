import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Check for admin routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (token.role !== "ADMIN" && token.role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
