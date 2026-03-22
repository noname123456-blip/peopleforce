import connectDB from "@/utils/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import SendEmail from "@/utils/SendEmail";



function isValidEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
    await connectDB();
    try {
        const body = await req.json();
        const { username, email, password } = body;

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        if (!isValidEmail(email)) {
            return NextResponse.json(
                { message: "Invalid email address" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.isVerified) {
            return NextResponse.json(
                { message: "User already exists. Please login." },
                { status: 409 }
            );
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        if (existingUser && !existingUser.isVerified) {
            existingUser.username = username;
            existingUser.password = await bcrypt.hash(password, 12);
            existingUser.verifyOTP = otp;
            existingUser.verifyOTPCreatedAt = new Date();
            existingUser.verifyOTPExpiry = otpExpiry;

            await existingUser.save();

            const isEmailSent = await SendEmail({ username: existingUser.username, email: existingUser.email, emailType: "Verify", otp: otp, id: existingUser._id });

            if (!isEmailSent) {
                return NextResponse.json(
                    { message: "Error in sending the verification email." },
                    { status: 400 }
                );

            }

            return NextResponse.json(
                { message: "OTP resent. Please verify your email." },
                { status: 200 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            verifyOTP: otp,
            verifyOTPCreatedAt: new Date(),
            verifyOTPExpiry: otpExpiry,
        });

        const isEmailSent = await SendEmail({ username: user.username, email: user.email, emailType: "Verify", otp: otp, id: user._id });

        if (!isEmailSent) {
            return NextResponse.json(
                { message: "Error in sending the verification email." },
                { status: 400 }
            );

        }

        return NextResponse.json(
            { message: "Signup successful. Please verify your email." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in Signup:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
