import connectDB from "@/utils/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Clear the JWT cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(0), 
    });

    return response;

  } catch (err) {
    console.error("Error in Logout:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
