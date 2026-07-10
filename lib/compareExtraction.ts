import {
  ALL_EXTRACTION_PROVIDERS,
  EXTRACTION_PROVIDER_OPTIONS,
  type CompareResult,
  type ExtractionProvider,
} from "@/types";

export function createInitialCompareResults(): CompareResult[] {
  return EXTRACTION_PROVIDER_OPTIONS.map((option) => ({
    provider: option.id,
    label: option.label,
    status: "idle",
  }));
}

export async function runCompareExtraction(
  image: File,
  onProgress?: (results: CompareResult[]) => void
): Promise<CompareResult[]> {
  const formData = new FormData();
  formData.append("image", image);

  const loadingResults = createInitialCompareResults().map((result) => ({
    ...result,
    status: "loading" as const,
  }));

  onProgress?.(loadingResults);

  const response = await fetch("/api/ocr/compare", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(errorData?.error || "Compare extraction request failed");
  }

  const data = (await response.json()) as {
    results: Array<{
      provider: ExtractionProvider;
      text?: string;
      error?: string;
    }>;
  };

  const labelByProvider = Object.fromEntries(
    EXTRACTION_PROVIDER_OPTIONS.map((option) => [option.id, option.label])
  ) as Record<ExtractionProvider, string>;

  return ALL_EXTRACTION_PROVIDERS.map((provider) => {
    const match = data.results.find((result) => result.provider === provider);

    if (match?.text) {
      return {
        provider,
        label: labelByProvider[provider],
        status: "success" as const,
        text: match.text,
      };
    }

    return {
      provider,
      label: labelByProvider[provider],
      status: "error" as const,
      error: match?.error || "No text was detected.",
    };
  });
}
