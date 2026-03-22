import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/utils/cloudinary";

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const result: any = await uploadToCloudinary(file);
    
    return NextResponse.json({ 
      url: result.secure_url, 
      filename: file.name,
      size: file.size,
      type: file.type,
      public_id: result.public_id
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
