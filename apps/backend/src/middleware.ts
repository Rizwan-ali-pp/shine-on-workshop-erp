import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-shineon-key";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  // Handle preflight OPTIONS requests for CORS
  if (request.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    res.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  }

  // We only want to protect API routes, except the auth ones
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  }

  if (request.nextUrl.pathname.startsWith("/api")) {
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      // Verify token using jose (edge compatible)
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      const res = NextResponse.next();
      res.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
      res.headers.set("Access-Control-Allow-Credentials", "true");
      return res;
    } catch (error) {
      const res = NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
      res.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
      res.headers.set("Access-Control-Allow-Credentials", "true");
      return res;
    }
  }

  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
