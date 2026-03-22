import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import SurveyTemplate from "@/models/SurveyTemplate";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest, { params }: any) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const template = await SurveyTemplate.findById(id).lean();
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    return NextResponse.json(template);
  } catch (err) {
    console.error("Survey template fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch survey template" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: any) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const template = await SurveyTemplate.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    return NextResponse.json(template);
  } catch (err) {
    console.error("Survey template update error:", err);
    return NextResponse.json({ error: "Failed to update survey template" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const template = await SurveyTemplate.findByIdAndDelete(id);
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Template deleted" });
  } catch (err) {
    console.error("Survey template delete error:", err);
    return NextResponse.json({ error: "Failed to delete survey template" }, { status: 500 });
  }
}
