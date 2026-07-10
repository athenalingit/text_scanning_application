"use client";

import { useRef, useState } from "react";

import CompareGrid from "@/components/CompareGrid";
import Header from "@/components/Header";
import NavTabs from "@/components/NavTabs";
import ChapterSelector from "@/components/ChapterSelector";
import TextEditorPanel from "@/components/TextEditorPanel";
import { useDocument } from "@/hooks/useDocument";
import {
  createInitialCompareResults,
  runCompareExtraction,
} from "@/lib/compareExtraction";
import { prepareImageForExtraction } from "@/lib/prepareImage";
import type { CompareResult, ExtractionProvider } from "@/types";

export default function ComparePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
  const [compareResults, setCompareResults] = useState<CompareResult[]>(
    createInitialCompareResults()
  );
  const [selectedProvider, setSelectedProvider] =
    useState<ExtractionProvider | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setCompareResults(createInitialCompareResults());
    setSelectedProvider(null);
    setCompareError(null);
    setAddedMessage(null);
    event.target.value = "";
  }

  async function handleRunAllExtractions() {
    if (!selectedImage) return;

    setIsRunning(true);
    setCompareError(null);
    setAddedMessage(null);
    setSelectedProvider(null);
    setCompareResults(
      createInitialCompareResults().map((result) => ({
        ...result,
        status: "loading",
      }))
    );

    try {
      const preparedImage = await prepareImageForExtraction(selectedImage);
      const results = await runCompareExtraction(preparedImage, setCompareResults);
      setCompareResults(results);

      const firstSuccess = results.find(
        (result) => result.status === "success" && result.text
      );

      if (firstSuccess) {
        setSelectedProvider(firstSuccess.provider);
      }
    } catch (error) {
      setCompareError(
        error instanceof Error
          ? error.message
          : "Compare extraction failed. Please try again."
      );
      setCompareResults(createInitialCompareResults());
    } finally {
      setIsRunning(false);
    }
  }

  function handleAddSelectedToChapter() {
    const selected = compareResults.find(
      (result) => result.provider === selectedProvider
    );

    if (!selected?.text) return;

    appendToActiveChapter(selected.text);
    setAddedMessage(`Added ${selected.label} result to chapter.`);
    setSelectedImage(null);
    setImagePreview(null);
    setCompareResults(createInitialCompareResults());
    setSelectedProvider(null);
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

            <section className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
              <h2 className="mb-3 text-base font-semibold sm:text-lg">Compare</h2>

              <input
                ref={fileInputRef}
                id="compare-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />

              <input
                ref={cameraInputRef}
                id="compare-camera-upload"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="sr-only"
              />

              <label
                htmlFor="compare-image-upload"
                className="mb-4 block cursor-pointer rounded-xl border-2 border-dashed border-neutral-300 p-3 text-center transition active:border-blue-400 active:bg-blue-50 sm:p-4 sm:hover:border-blue-400 sm:hover:bg-blue-50"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto max-h-48 w-full rounded-lg object-contain sm:max-h-64"
                  />
                ) : (
                  <div className="py-6 sm:py-8">
                    <p className="text-sm font-medium text-neutral-700">
                      Tap to choose an image
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      All 4 models will extract from this photo
                    </p>
                  </div>
                )}
              </label>

              <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="min-h-11 rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium active:bg-neutral-100 sm:hidden"
                >
                  Take Photo
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-11 rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium active:bg-neutral-100 sm:col-span-2 sm:hover:bg-neutral-100"
                >
                  Choose Image
                </button>
              </div>

              <button
                type="button"
                onClick={handleRunAllExtractions}
                disabled={!imagePreview || isRunning}
                className="min-h-12 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white active:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-300 sm:py-2 sm:hover:bg-blue-700"
              >
                {isRunning ? "Running all extractions..." : "Run All 4 Models"}
              </button>

              {compareError && (
                <p className="mt-3 text-sm text-red-600">{compareError}</p>
              )}
            </section>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <section className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
              <h2 className="mb-3 text-base font-semibold sm:text-lg">
                Model Results
              </h2>
              <p className="mb-4 text-sm text-neutral-600">
                Click the best extraction below, then add it to your chapter.
              </p>

              <CompareGrid
                results={compareResults}
                selectedProvider={selectedProvider}
                onSelect={setSelectedProvider}
              />

              <button
                type="button"
                onClick={handleAddSelectedToChapter}
                disabled={!selectedProvider}
                className="mt-4 min-h-12 w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white active:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 sm:hover:bg-neutral-800"
              >
                Add Selected to Chapter
              </button>

              {addedMessage && (
                <p className="mt-3 text-sm text-green-600">{addedMessage}</p>
              )}
            </section>

            <TextEditorPanel
              chapterTitle={activeChapter?.title || "Chapter"}
              text={activeChapter?.text || ""}
              onChapterTitleChange={updateActiveChapterTitle}
              onTextChange={updateActiveChapterText}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
