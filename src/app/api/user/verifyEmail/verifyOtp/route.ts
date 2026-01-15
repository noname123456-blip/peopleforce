import User from "@/models/User";
import connectDB from "@/utils/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { otp, id } = body;

    if (!otp || !id) {
      return NextResponse.json(
        { message: "OTP and user ID are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "User already verified" },
        { status: 409 }
      );
    }

    const currentTime = Date.now();

    if (!user.verifyOTP || !user.verifyOTPExpiry || user.verifyOTPExpiry.getTime() < currentTime) {
      return NextResponse.json(
        { message: "OTP expired. Please request a new one." },
        { status: 400 }
      );
    }

    const isOtpValid = (otp === user.verifyOTP);

    if (!isOtpValid) {
      return NextResponse.json(
        { message: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifyOTP = undefined;
    user.verifyOTPExpiry = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully!" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error verifying OTP:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
