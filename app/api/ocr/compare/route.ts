import { NextRequest, NextResponse } from "next/server";

import { extractTextFromImage } from "@/lib/extractText";
import { ALL_EXTRACTION_PROVIDERS } from "@/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image");

  if (!image || !(image instanceof Blob)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const imageBuffer = Buffer.from(await image.arrayBuffer());

  const results = await Promise.all(
    ALL_EXTRACTION_PROVIDERS.map(async (provider) => {
      try {
        const text = await extractTextFromImage(imageBuffer, provider);

        if (!text) {
          return {
            provider,
            error: "No text was detected in this image.",
          };
        }

        return { provider, text };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Extraction request failed";

        return { provider, error: message };
      }
    })
  );

  return NextResponse.json({ results });
}
