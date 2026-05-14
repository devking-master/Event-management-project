import jwt from "jsonwebtoken";
import type { JwtUser } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please add JWT_SECRET to .env.local");
}

export function signToken(payload: JwtUser): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: "7d" });
}

export function verifyToken(token?: string): JwtUser | null {
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET as string) as JwtUser;
  } catch {
    return null;
  }
}
