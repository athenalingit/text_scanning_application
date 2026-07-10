export type Chapter = {
  id: string;
  title: string;
  text: string;
};

export type ExtractionStatus = "idle" | "processing" | "done" | "error";

export type ExtractionProvider = "groq" | "claude" | "openai" | "google-vision";

export type ExtractionResponse = {
  text: string;
};

export type ExtractionProviderOption = {
  id: ExtractionProvider;
  label: string;
  description: string;
  envHint: string;
};

export const EXTRACTION_PROVIDER_OPTIONS: ExtractionProviderOption[] = [
  {
    id: "groq",
    label: "Groq",
    description: "Fast vision models such as Qwen.",
    envHint: "GROQ_API_KEY",
  },
  {
    id: "claude",
    label: "Claude",
    description: "Anthropic vision API.",
    envHint: "ANTHROPIC_API_KEY",
  },
  {
    id: "openai",
    label: "GPT",
    description: "OpenAI vision models.",
    envHint: "OPENAI_API_KEY",
  },
  {
    id: "google-vision",
    label: "Google Vision OCR",
    description: "Google Cloud dedicated OCR.",
    envHint: "GOOGLE_APPLICATION_CREDENTIALS",
  },
];

export const ALL_EXTRACTION_PROVIDERS: ExtractionProvider[] = [
  "groq",
  "claude",
  "openai",
  "google-vision",
];

export type CompareResult = {
  provider: ExtractionProvider;
  label: string;
  status: "idle" | "loading" | "success" | "error";
  text?: string;
  error?: string;
};

export type CompareExtractionResponse = {
  results: Array<{
    provider: ExtractionProvider;
    text?: string;
    error?: string;
  }>;
};
