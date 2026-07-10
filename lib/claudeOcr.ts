import Anthropic from "@anthropic-ai/sdk";

import {
  EXTRACTION_PROMPT,
  SYSTEM_PROMPT,
  assertImageSize,
  cleanExtractedText,
  toBase64Image,
} from "@/lib/extractionUtils";

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

let anthropicClient: Anthropic | null = null;

type AnthropicMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "Anthropic API key is not configured. Add ANTHROPIC_API_KEY to .env.local."
    );
  }

  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  return anthropicClient;
}

function toAnthropicMediaType(mimeType: string): AnthropicMediaType {
  if (mimeType === "image/png") return "image/png";
  if (mimeType === "image/gif") return "image/gif";
  if (mimeType === "image/webp") return "image/webp";
  return "image/jpeg";
}

export async function extractTextWithClaude(
  imageBuffer: Buffer
): Promise<string> {
  assertImageSize(imageBuffer, "Claude");

  const client = getAnthropicClient();
  const { mimeType, base64 } = toBase64Image(imageBuffer);
  const model = process.env.ANTHROPIC_OCR_MODEL || DEFAULT_MODEL;

  const response = await client.messages.create({
    model,
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: toAnthropicMediaType(mimeType),
              data: base64,
            },
          },
          { type: "text", text: EXTRACTION_PROMPT },
        ],
      },
    ],
  });

  const rawText = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return cleanExtractedText(rawText);
}
