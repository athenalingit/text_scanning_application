"use client";

import { useEffect, useState } from "react";

import { loadDocument, saveDocument } from "@/lib/documentStorage";
import type { Chapter } from "@/types";

export function useDocument() {
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "chapter-1", title: "Chapter 1", text: "" },
  ]);
  const [activeChapterId, setActiveChapterId] = useState("chapter-1");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadDocument();
    setDocumentTitle(stored.documentTitle);
    setChapters(stored.chapters);
    setActiveChapterId(stored.activeChapterId);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    saveDocument({
      documentTitle,
      chapters,
      activeChapterId,
    });
  }, [documentTitle, chapters, activeChapterId, isLoaded]);

  const activeChapter = chapters.find(
    (chapter) => chapter.id === activeChapterId
  );

  function updateActiveChapterText(newText: string) {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === activeChapterId
          ? { ...chapter, text: newText }
          : chapter
      )
    );
  }

  function updateActiveChapterTitle(newTitle: string) {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === activeChapterId
          ? { ...chapter, title: newTitle }
          : chapter
      )
    );
  }

  function appendToActiveChapter(text: string) {
    if (!activeChapter) return;

    const updatedText = activeChapter.text
      ? `${activeChapter.text}\n\n${text}`
      : text;

    updateActiveChapterText(updatedText);
  }

  function addChapter() {
    const newChapter: Chapter = {
      id: `chapter-${chapters.length + 1}`,
      title: `Chapter ${chapters.length + 1}`,
      text: "",
    };

    setChapters((prev) => [...prev, newChapter]);
    setActiveChapterId(newChapter.id);
  }

  function exportDocument() {
    const fullText = chapters
      .map((chapter) => `${chapter.title}\n\n${chapter.text}`)
      .join("\n\n--------------------\n\n");

    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${documentTitle || "document"}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return {
    documentTitle,
    setDocumentTitle,
    chapters,
    activeChapterId,
    setActiveChapterId,
    activeChapter,
    updateActiveChapterText,
    updateActiveChapterTitle,
    appendToActiveChapter,
    addChapter,
    exportDocument,
    isLoaded,
  };
}
