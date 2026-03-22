import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Asset from "@/models/Asset";
import AssetCategory from "@/models/AssetCategory";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const assets = await Asset.find().populate("asset_category_id", "asset_category_name").sort({ createdAt: -1 }).lean();
    return NextResponse.json(assets);
  } catch { return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = await req.json();
    const asset = await Asset.create(body);
    return NextResponse.json(asset, { status: 201 });
  } catch (err: any) { return NextResponse.json({ error: err.message || "Failed to create asset" }, { status: 500 }); }
}
