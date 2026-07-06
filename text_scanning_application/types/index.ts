export type Chapter = {
  id: string;
  title: string;
  text: string;
};

export type ExtractionStatus = "idle" | "processing" | "done" | "error";

export type ExtractionResponse = {
  text: string;
};
