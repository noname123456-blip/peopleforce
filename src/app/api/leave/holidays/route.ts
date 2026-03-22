import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Holiday from "@/models/Holiday";

connectDB();

export async function GET(req: NextRequest) {
    try {
        await getDataFromToken(req);
        const { searchParams } = new URL(req.url);
        const year = searchParams.get("year");

        let filter: Record<string, any> = {};
        if (year) {
            const startOfYear = new Date(`${year}-01-01`);
            const endOfYear = new Date(`${year}-12-31`);
            filter.start_date = { $gte: startOfYear, $lte: endOfYear };
        }

        const list = await Holiday.find(filter).sort({ start_date: 1 }).lean();
        return NextResponse.json({ data: list });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to fetch holidays" },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await getDataFromToken(req);
        const body = await req.json();

        if (!body.name || !body.start_date) {
            return NextResponse.json({ error: "Name and start date are required" }, { status: 400 });
        }

        const doc = await Holiday.create(body);
        return NextResponse.json(doc, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to create holiday" },
            { status: 500 },
        );
    }
}
