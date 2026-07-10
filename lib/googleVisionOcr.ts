import { ImageAnnotatorClient } from "@google-cloud/vision";

import { loadGoogleCredentials } from "@/lib/googleCredentials";

let visionClient: ImageAnnotatorClient | null = null;

function getVisionClient(): ImageAnnotatorClient {
  if (visionClient) {
    return visionClient;
  }

  visionClient = new ImageAnnotatorClient({
    credentials: loadGoogleCredentials(),
  });

  return visionClient;
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
