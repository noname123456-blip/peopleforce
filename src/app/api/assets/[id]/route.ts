import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Asset from "@/models/Asset";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const asset = await Asset.findById(id).populate("asset_category_id").lean();
    if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    return NextResponse.json(asset);
  } catch { return NextResponse.json({ error: "Failed to fetch asset" }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const body = await req.json();
    const asset = await Asset.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    return NextResponse.json(asset);
  } catch { return NextResponse.json({ error: "Failed to update asset" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const asset = await Asset.findByIdAndDelete(id);
    if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    return NextResponse.json({ message: "Asset deleted" });
  } catch { return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 }); }
}
