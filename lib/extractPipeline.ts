import { markDisagreements } from "@/lib/disagreements";
import {
  cleanImage,
  createEnlargedGreyscaleImage,
} from "@/lib/imageCleaning";
import { reconcileWithLlm } from "@/lib/llmReconcile";
import { runOcrPass } from "@/lib/ocrPass";

export async function runExtractionPipeline(
  imageBuffer: Buffer
): Promise<string> {
  const cleanedImage = await cleanImage(imageBuffer);
  const enlargedGreyscaleImage =
    await createEnlargedGreyscaleImage(cleanedImage);

  const [pass1, pass2] = await Promise.all([
    runOcrPass(cleanedImage),
    runOcrPass(enlargedGreyscaleImage),
  ]);

  if (!pass1 && !pass2) {
    throw new Error("No text was detected in this image.");
  }

  const disagreements = markDisagreements(pass1, pass2);
  const finalText = await reconcileWithLlm({
    pass1,
    pass2,
    disagreements,
  });

  if (!finalText) {
    throw new Error("LLM verification returned no text.");
  }

  return finalText;
}
