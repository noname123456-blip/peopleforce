import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import type { Role } from "@/lib/types";

export interface TokenPayload {
  id: string;
  email?: string;
  username?: string;
  role?: Role;
  employeeId?: string;
}

const getDataFromToken = async (req: NextRequest): Promise<TokenPayload> => {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "shaiman"
    ) as TokenPayload;
    return decoded;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Invalid or expired token"
    );
  }
};

export default getDataFromToken;