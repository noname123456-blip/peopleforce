import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import LeaveRestriction from "@/models/LeaveRestriction";

connectDB();

export async function GET(req: NextRequest) {
    try {
        await getDataFromToken(req);
        const list = await LeaveRestriction.find({})
            .populate("leave_type_id", "name")
            .populate("department_id", "name")
            .sort({ start_date: 1 })
            .lean();
        return NextResponse.json({ data: list });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to fetch restrictions" },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await getDataFromToken(req);
        const body = await req.json();

        if (!body.title || !body.start_date || !body.end_date) {
            return NextResponse.json({ error: "Title and dates are required" }, { status: 400 });
        }

        const doc = await LeaveRestriction.create(body);
        return NextResponse.json(doc, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to create restriction" },
            { status: 500 },
        );
    }
}
