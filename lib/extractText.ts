import { extractTextWithClaude } from "@/lib/claudeOcr";
import { extractTextWithGoogleVision } from "@/lib/googleVisionOcr";
import { extractTextWithGroq } from "@/lib/groqOcr";
import { extractTextWithOpenAI } from "@/lib/openaiOcr";
import type { ExtractionProvider } from "@/types";

export async function extractTextFromImage(
  imageBuffer: Buffer,
  provider: ExtractionProvider
): Promise<string> {
  switch (provider) {
    case "groq":
      return extractTextWithGroq(imageBuffer);
    case "claude":
      return extractTextWithClaude(imageBuffer);
    case "openai":
      return extractTextWithOpenAI(imageBuffer);
    case "google-vision":
      return extractTextWithGoogleVision(imageBuffer);
    default:
      throw new Error("Unknown extraction provider.");
  }
}
