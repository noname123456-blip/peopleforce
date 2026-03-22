import connectDB from "@/utils/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";


connectDB();

function isValidEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and Password both are required!" },
                { status: 400 }
            );
        }

        if (!isValidEmail(email)) {
            return NextResponse.json(
                { error: "Please enter valid email!" },
                { status: 400 }
            );
        }

        console.log("Email: ", email)
        console.log("Password: ", password)

        const user = await User.findOne({ email: email })

        if (!user || !user.isVerified) {
            return NextResponse.json(
                { error: "Invalid email or password!" },
                { status: 400 }
            );
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { error: "Invalid email or password!" },
                { status: 400 }
            );
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role || "EMPLOYEE",
            },
            process.env.JWT_SECRET || "shaiman",
            { expiresIn: "24h" }
        );

        console.log(token)

        const response = NextResponse.json(
            { message: "Login successful", token },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 86400,
        });

        return response;


    } catch (err) {
        console.log("Error in Login: ", err);
        return NextResponse.json(
            { error: "Internal Error in Login!" },
            { status: 500 }
        );
    }
}