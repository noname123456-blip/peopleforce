import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import CompanyLeave from "@/models/CompanyLeave";

connectDB();

export async function GET(req: NextRequest) {
    try {
        await getDataFromToken(req);
        const list = await CompanyLeave.find({}).sort({ based_on_week: 1, based_on_week_day: 1 }).lean();
        return NextResponse.json({ data: list });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to fetch company leaves" },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await getDataFromToken(req);
        const body = await req.json();

        if (body.based_on_week_day === undefined) {
            return NextResponse.json({ error: "Week day is required" }, { status: 400 });
        }

        const doc = await CompanyLeave.create(body);
        return NextResponse.json(doc, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to create company leave" },
            { status: 500 },
        );
    }
}
