import Groq from "groq-sdk";

const SYSTEM_PROMPT =
  "You are a transcription engine. Copy visible text from images exactly. Return plain text only. Do not explain, plan, summarize, or add steps.";

const EXTRACTION_PROMPT =
  "Transcribe all visible Chinese text from this book page in natural reading order. Output only the transcribed text.";

const DEFAULT_MODEL = "qwen/qwen3.6-27b";
const MAX_BASE64_IMAGE_BYTES = 4 * 1024 * 1024;
const CJK_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;

let groqClient: Groq | null = null;

export function validateGroqCredentials(): string | null {
  if (!process.env.GROQ_API_KEY) {
    return "Groq API key is not configured. Add GROQ_API_KEY to .env.local in the project root.";
  }

  return null;
}

function getGroqClient(): Groq {
  if (groqClient) {
    return groqClient;
  }

  groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  return groqClient;
}

function getImageMimeType(imageBuffer: Buffer): string {
  if (imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8) {
    return "image/jpeg";
  }

  if (
    imageBuffer[0] === 0x89 &&
    imageBuffer[1] === 0x50 &&
    imageBuffer[2] === 0x4e &&
    imageBuffer[3] === 0x47
  ) {
    return "image/png";
  }

  if (imageBuffer[0] === 0x47 && imageBuffer[1] === 0x49) {
    return "image/gif";
  }

  if (
    imageBuffer[0] === 0x52 &&
    imageBuffer[1] === 0x49 &&
    imageBuffer[2] === 0x46 &&
    imageBuffer[3] === 0x46
  ) {
    return "image/webp";
  }

  return "image/jpeg";
}

function hasCjk(text: string): boolean {
  return CJK_REGEX.test(text);
}

function stripInstructionPrefix(line: string): string {
  const match = line.match(CJK_REGEX);

  if (!match || match.index === undefined || match.index === 0) {
    return line;
  }

  return line.slice(match.index).trim();
}

function isMetaLine(line: string): boolean {
  const normalized = line.trim();

  if (!normalized) {
    return true;
  }

  if (hasCjk(normalized)) {
    return false;
  }

  return (
    /^(the user|i will|let me|here is|extracted text|transcription|step \d+)/i.test(
      normalized
    ) ||
    /^\d+\.\s/.test(normalized) ||
    /^\*\*.+\*\*:?\s*$/.test(normalized) ||
    /^#{1,6}\s/.test(normalized)
  );
}

function cleanExtractedText(raw: string): string {
  let text = raw.trim();

  text = text.replace(/[\s\S]*?<\/think>/gi, "").trim();
  text = text.replace(/^```[\w-]*\n?/, "").replace(/\n?```$/, "").trim();

  const lines = text
    .split(/\r?\n/)
    .map(stripInstructionPrefix)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !isMetaLine(line));

  const cjkLines = lines.filter((line) => hasCjk(line));

  if (cjkLines.length > 0) {
    return cjkLines.join("\n").trim();
  }

  return lines.join("\n").trim();
}

export async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  if (imageBuffer.length > MAX_BASE64_IMAGE_BYTES) {
    throw new Error(
      "Image is too large for extraction. Please use an image under 4MB."
    );
  }

  const client = getGroqClient();
  const mimeType = getImageMimeType(imageBuffer);
  const base64Image = imageBuffer.toString("base64");
  const model = process.env.GROQ_OCR_MODEL || DEFAULT_MODEL;

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: [
          { type: "text", text: EXTRACTION_PROMPT },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    max_completion_tokens: 4096,
    temperature: 0,
    reasoning_effort: "none",
  });

  const rawText = response.choices[0]?.message?.content ?? "";
  return cleanExtractedText(rawText);
}
