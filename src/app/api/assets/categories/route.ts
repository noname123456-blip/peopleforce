import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import AssetCategory from "@/models/AssetCategory";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const categories = await AssetCategory.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(categories);
  } catch { return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = await req.json();
    const category = await AssetCategory.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (err: any) { return NextResponse.json({ error: err.message || "Failed to create category" }, { status: 500 }); }
}
