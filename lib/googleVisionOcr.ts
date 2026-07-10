import fs from "fs";
import path from "path";

import { ImageAnnotatorClient } from "@google-cloud/vision";

let visionClient: ImageAnnotatorClient | null = null;

function resolveCredentialsPath(credentialsPath: string): string {
  return path.isAbsolute(credentialsPath)
    ? credentialsPath
    : path.join(process.cwd(), credentialsPath);
}

function loadCredentialsFromFile(credentialsPath: string) {
  const resolvedPath = resolveCredentialsPath(credentialsPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(
      `Google credentials file not found at ${resolvedPath}. Update GOOGLE_APPLICATION_CREDENTIALS in .env.local.`
    );
  }

  return JSON.parse(fs.readFileSync(resolvedPath, "utf8")) as Record<
    string,
    unknown
  >;
}

function getVisionClient(): ImageAnnotatorClient {
  if (visionClient) {
    return visionClient;
  }

  const credentialsJson = process.env.GOOGLE_CLOUD_CREDENTIALS;

  if (credentialsJson) {
    visionClient = new ImageAnnotatorClient({
      credentials: JSON.parse(credentialsJson),
    });
    return visionClient;
  }

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (credentialsPath) {
    const credentials = loadCredentialsFromFile(credentialsPath);
    visionClient = new ImageAnnotatorClient({ credentials });
    return visionClient;
  }

  throw new Error(
    "Google Cloud credentials are not configured. Set GOOGLE_APPLICATION_CREDENTIALS in .env.local."
  );
}

export async function extractTextWithGoogleVision(
  imageBuffer: Buffer
): Promise<string> {
  const client = getVisionClient();
  const imageContext = { languageHints: ["zh", "zh-CN", "zh-TW"] };

  const [documentResult] = await client.documentTextDetection({
    image: { content: imageBuffer },
    imageContext,
  });

  const documentText = documentResult.fullTextAnnotation?.text?.trim() ?? "";

  if (documentText) {
    return documentText;
  }

  const [textResult] = await client.textDetection({
    image: { content: imageBuffer },
    imageContext,
  });

  return textResult.textAnnotations?.[0]?.description?.trim() ?? "";
}
