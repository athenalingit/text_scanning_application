import { NextRequest, NextResponse } from "next/server";

import {
  extractTextFromImage,
  validateGroqCredentials,
} from "@/lib/groqOcr";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image");

  if (!image || !(image instanceof Blob)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const credentialsError = validateGroqCredentials();

  if (credentialsError) {
    return NextResponse.json({ error: credentialsError }, { status: 500 });
  }

  try {
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const text = await extractTextFromImage(imageBuffer);

    if (!text) {
      return NextResponse.json(
        { error: "No text was detected in this image." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Extraction error:", error);

    const message =
      error instanceof Error ? error.message : "Extraction request failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
