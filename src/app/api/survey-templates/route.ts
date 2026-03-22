import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import SurveyTemplate from "@/models/SurveyTemplate";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const data = await SurveyTemplate.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Survey templates list error:", err);
    return NextResponse.json({ error: "Failed to fetch survey templates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const template = await SurveyTemplate.create(body);
    return NextResponse.json(template, { status: 201 });
  } catch (err) {
    console.error("Survey template create error:", err);
    return NextResponse.json({ error: "Failed to create survey template" }, { status: 500 });
  }
}
