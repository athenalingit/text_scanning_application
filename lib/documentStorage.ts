import type { Chapter } from "@/types";

export type StoredDocument = {
  documentTitle: string;
  chapters: Chapter[];
  activeChapterId: string;
};

const STORAGE_KEY = "text-scanning-document";

const DEFAULT_DOCUMENT: StoredDocument = {
  documentTitle: "Untitled Document",
  chapters: [{ id: "chapter-1", title: "Chapter 1", text: "" }],
  activeChapterId: "chapter-1",
};

export function loadDocument(): StoredDocument {
  if (typeof window === "undefined") {
    return DEFAULT_DOCUMENT;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return DEFAULT_DOCUMENT;
    }

    const parsed = JSON.parse(raw) as StoredDocument;

    if (!parsed.chapters?.length) {
      return DEFAULT_DOCUMENT;
    }

    return parsed;
  } catch {
    return DEFAULT_DOCUMENT;
  }
}

export function saveDocument(document: StoredDocument): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
}
