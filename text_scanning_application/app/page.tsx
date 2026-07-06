"use client";

import { useState } from "react";

import ChapterSelector from "@/components/ChapterSelector";
import Header from "@/components/Header";
import ScanPanel from "@/components/ScanPanel";
import TextEditorPanel from "@/components/TextEditorPanel";
import { runExtraction } from "@/lib/ocr";
import type { Chapter, ExtractionStatus } from "@/types";

export default function Home() {
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: "chapter-1",
      title: "Chapter 1",
      text: "",
    },
  ]);

  const [activeChapterId, setActiveChapterId] = useState("chapter-1");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractionStatus, setExtractionStatus] =
    useState<ExtractionStatus>("idle");
  const [extractionError, setExtractionError] = useState<string | null>(null);

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

  function addChapter() {
    const newChapter: Chapter = {
      id: `chapter-${chapters.length + 1}`,
      title: `Chapter ${chapters.length + 1}`,
      text: "",
    };

    setChapters((prev) => [...prev, newChapter]);
    setActiveChapterId(newChapter.id);
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setExtractionStatus("idle");
    setExtractionError(null);
  }

  async function handleRunExtraction() {
    if (!selectedImage || !activeChapter) return;

    setExtractionStatus("processing");
    setExtractionError(null);

    try {
      const extractedText = await runExtraction(selectedImage);

      const updatedText = activeChapter.text
        ? `${activeChapter.text}\n\n${extractedText}`
        : extractedText;

      updateActiveChapterText(updatedText);
      setExtractionStatus("done");
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      setExtractionStatus("error");
      setExtractionError(
        error instanceof Error
          ? error.message
          : "Extraction failed. Please try again."
      );
    }
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

  return (
    <main className="min-h-screen bg-neutral-100 px-3 py-3 text-neutral-900 sm:p-4">
      <div className="mx-auto max-w-6xl pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Header
          documentTitle={documentTitle}
          onDocumentTitleChange={setDocumentTitle}
          onExport={exportDocument}
        />

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[320px_1fr]">
          <div className="space-y-3 sm:space-y-4">
            <section className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
              <ChapterSelector
                chapters={chapters}
                activeChapterId={activeChapterId}
                onChapterChange={setActiveChapterId}
                onAddChapter={addChapter}
              />
            </section>

            <ScanPanel
              imagePreview={imagePreview}
              extractionStatus={extractionStatus}
              errorMessage={extractionError}
              onImageUpload={handleImageUpload}
              onRunExtraction={handleRunExtraction}
            />
          </div>

          <TextEditorPanel
            chapterTitle={activeChapter?.title || "Chapter"}
            text={activeChapter?.text || ""}
            onTextChange={updateActiveChapterText}
          />
        </div>
      </div>
    </main>
  );
}
