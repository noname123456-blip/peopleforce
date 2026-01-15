import User from "@/models/User";
import connectDB from "@/utils/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import SendEmail from "@/utils/SendEmail";

connectDB();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { message: "User id is required" },
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

        // Optional: rate limiting (example: 1 OTP per 1 minute)
        if (user.verifyOTPCreatedAt && Date.now() - user.verifyOTPCreatedAt.getTime() < 60 * 1000) {
            return NextResponse.json(
                { message: "Please wait before requesting another OTP." },
                { status: 429 }
            );
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        user.verifyOTP = otp;
        user.verifyOTPExpiry = otpExpiry;
        user.verifyOTPCreatedAt = new Date();
        await user.save();

        const isEmailSent = SendEmail({ username: user.username, email: user.email, emailType: "Verify", otp: otp, id: user._id });

        if (!isEmailSent) {
            return NextResponse.json(
                { message: "Error in sending the verification email." },
                { status: 400 }
            );

        }

        return NextResponse.json(
            { message: "OTP resent successfully. Please check your email." },
            { status: 200 }
        );

    } catch (err) {
        console.error("Error resending OTP:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
