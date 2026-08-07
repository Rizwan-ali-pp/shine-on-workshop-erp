import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-shineon-key";

export async function GET(req: Request) {
  try {
    // Next.js Request cookies approach
    const cookieHeader = req.headers.get("cookie");
    const match = cookieHeader?.match(new RegExp("(^| )auth_token=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json(
      { admin: payload },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
