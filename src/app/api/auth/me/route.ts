import { NextRequest, NextResponse } from "next/server";
import getDataFromToken from "@/utils/getDataFromToken";
import User from "@/models/User";
import connectDB from "@/utils/dbConfig";

connectDB();

export async function GET(req: NextRequest) {
  try {
    const payload = await getDataFromToken(req);
    const user = await User.findById(payload.id).select(
      "username email role isVerified"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role || "EMPLOYEE",
      isVerified: user.isVerified,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
