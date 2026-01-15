import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req:NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublic = path === "/login" || path === "/signup";
    const token = req.cookies.get("token")?.value || "";
    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token && isPublic) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/dashboard",
        "/login",
        "/signup",
        "/verifyEmail",
        "/resetPassword",
        "/forgotPassword",
    ],
}