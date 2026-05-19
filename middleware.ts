import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";

async function getPayload(token?: string) {
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  const payload = await getPayload(token);
  const role = payload?.role as string | undefined;

  if (isDashboardRoute) {
    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const attendeeAllowedRoutes = [
      "/dashboard",
      "/dashboard/tickets",
      "/dashboard/settings",
      "/dashboard/settings/profile",
      "/dashboard/settings/security",
      "/dashboard/settings/payment",
    ];

    if (role === "user") {
      const allowed = attendeeAllowedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      );

      if (!allowed) {
        return NextResponse.redirect(new URL("/dashboard/tickets", req.url));
      }
    }

    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }

  if (isAuthRoute && payload) {
    return NextResponse.redirect(
      new URL(role === "user" ? "/events" : "/dashboard", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
