"use client";

import { useState } from "react";

import ChapterSelector from "@/components/ChapterSelector";
import Header from "@/components/Header";
import NavTabs from "@/components/NavTabs";
import ScanPanel from "@/components/ScanPanel";
import TextEditorPanel from "@/components/TextEditorPanel";
import { useDocument } from "@/hooks/useDocument";
import { runExtraction } from "@/lib/ocr";
import { prepareImageForExtraction } from "@/lib/prepareImage";
import type { ExtractionStatus } from "@/types";

export default function ScanPage() {
  const {
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
  } = useDocument();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractionStatus, setExtractionStatus] =
    useState<ExtractionStatus>("idle");
  const [extractionError, setExtractionError] = useState<string | null>(null);

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
      const preparedImage = await prepareImageForExtraction(selectedImage);
      const extractedText = await runExtraction(preparedImage);

      appendToActiveChapter(extractedText);
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

  if (!isLoaded) {
    return null;
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-3 py-3 text-neutral-900 sm:p-4">
      <div className="mx-auto max-w-6xl pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <NavTabs />

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
              inputId="scan-upload"
              cameraInputId="scan-camera"
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
            onChapterTitleChange={updateActiveChapterTitle}
            onTextChange={updateActiveChapterText}
          />
        </div>
      </div>
    </main>
  );
}
