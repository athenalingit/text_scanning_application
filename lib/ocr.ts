import type { ExtractionResponse } from "@/types";

export async function runExtraction(image: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch("/api/ocr", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(errorData?.error || "Extraction request failed");
  }

  const data: ExtractionResponse = await response.json();
  return data.text;
}
