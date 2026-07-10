import { NextRequest, NextResponse } from "next/server";

import { extractTextWithGoogleVision } from "@/lib/googleVisionOcr";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image");

  if (!image || !(image instanceof Blob)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  try {
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const text = await extractTextWithGoogleVision(imageBuffer);

    if (!text) {
      return NextResponse.json(
        { error: "No text was detected in this image." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Google Vision extraction error:", error);

    const message =
      error instanceof Error ? error.message : "Extraction request failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
