import OpenAI from "openai";

import {
  EXTRACTION_PROMPT,
  SYSTEM_PROMPT,
  assertImageSize,
  cleanExtractedText,
  toBase64Image,
} from "@/lib/extractionUtils";

const DEFAULT_MODEL = "gpt-4o-mini";

let openaiClient: OpenAI | null = null;

function getOpenAiClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured. Add OPENAI_API_KEY to .env.local.");
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return openaiClient;
}

export async function extractTextWithOpenAI(
  imageBuffer: Buffer
): Promise<string> {
  assertImageSize(imageBuffer, "OpenAI");

  const client = getOpenAiClient();
  const { mimeType, base64 } = toBase64Image(imageBuffer);
  const model = process.env.OPENAI_OCR_MODEL || DEFAULT_MODEL;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: EXTRACTION_PROMPT },
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${base64}` },
          },
        ],
      },
    ],
    max_tokens: 8192,
    temperature: 0,
  });

  return cleanExtractedText(response.choices[0]?.message?.content ?? "");
}
