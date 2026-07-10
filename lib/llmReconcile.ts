import Groq from "groq-sdk";

import { cleanExtractedText } from "@/lib/extractionUtils";

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (groqClient) {
    return groqClient;
  }

  if (!process.env.GROQ_API_KEY) {
    throw new Error(
      "Groq API key is not configured. Add GROQ_API_KEY to .env.local for LLM verification."
    );
  }

  groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  return groqClient;
}

export async function reconcileWithLlm(input: {
  pass1: string;
  pass2: string;
  disagreements: string;
}): Promise<string> {
  const client = getGroqClient();
  const model = process.env.GROQ_RECONCILE_MODEL || "qwen/qwen3.6-27b";

  const prompt = `You are verifying OCR output from a Chinese book page.

Two PaddleOCR passes produced these results:

PASS 1 (cleaned color image):
${input.pass1 || "(empty)"}

PASS 2 (enlarged greyscale image):
${input.pass2 || "(empty)"}

DISAGREEMENTS:
${input.disagreements}

Choose the most accurate reading using both passes. Resolve disagreements carefully.
Return only the final corrected Chinese transcription with natural reading order.
Do not add commentary.`;

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    max_completion_tokens: 8192,
    temperature: 0,
    reasoning_effort: "none",
  });

  const rawText = response.choices[0]?.message?.content ?? "";
  return cleanExtractedText(rawText);
}
