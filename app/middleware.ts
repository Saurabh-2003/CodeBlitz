import { NextResponse } from "next/server";
import { UserDetail } from "./core";
import GetServerSession from "./core/hooks/getServerSession";

export async function middleware(request: Request) {
  try {
    const session = await GetServerSession();

    if (!session) {
      // Redirect to the sign-in page if no session exists
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    const { user } = await UserDetail();

    // If the user is neither ADMIN nor SUPERADMIN, redirect to /profile
    if (user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    // Allow the request to proceed if the user is authorized
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL("/error", request.url)); // Handle the error gracefully
  }
}

export const config = {
  matcher: ["/dashboard/:path*"], // Match /dashboard and all its sub-paths
};
