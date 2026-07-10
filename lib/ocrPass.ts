import { extractTextWithGroq } from "@/lib/groqOcr";
import { runPaddleOcr } from "@/lib/paddleOcr";

export async function runOcrPass(imageBuffer: Buffer): Promise<string> {
  try {
    const text = await runPaddleOcr(imageBuffer);
    if (text) {
      return text;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const paddleUnavailable =
      message.includes("No module named 'paddleocr'") ||
      message.includes("Python was not found") ||
      message.includes("PaddleOCR returned no output") ||
      message.includes("Set PYTHON_PATH");

    if (!paddleUnavailable) {
      throw error;
    }

    console.warn("PaddleOCR unavailable, falling back to Groq vision:", message);
  }

  return extractTextWithGroq(imageBuffer);
}
