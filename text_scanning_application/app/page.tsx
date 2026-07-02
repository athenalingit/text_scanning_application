"use client";

import { useState } from "react";

type Chapter = {
  id: string;
  title: string;
  text: string;
};

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrStatus, setOcrStatus] = useState<"idle" | "processing" | "done">(
    "idle"
  );

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

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setOcrStatus("idle");
  }

  function processMockOCR() {
    if (!imagePreview || !activeChapter) return;

    setOcrStatus("processing");

    // This is fake OCR for now.
    // Later, replace this with a real API call to Google Cloud Vision OCR.
    setTimeout(() => {
      const mockText =
        "这是从图片中识别出来的中文文本。之后这里会显示真正的 OCR 结果。";

      const updatedText = activeChapter.text
        ? `${activeChapter.text}\n\n${mockText}`
        : mockText;

      updateActiveChapterText(updatedText);
      setOcrStatus("done");
      setImagePreview(null);
    }, 1000);
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
    <main className="min-h-screen bg-neutral-100 p-4 text-neutral-900">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-500">Text Scanning App</p>
              <input
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="w-full border-none text-2xl font-bold outline-none"
              />
            </div>

            <button
              onClick={exportDocument}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Export TXT
            </button>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          {/* Left Panel */}
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Scan</h2>

            <label className="mb-3 block text-sm font-medium">
              Current Chapter
            </label>

            <select
              value={activeChapterId}
              onChange={(e) => setActiveChapterId(e.target.value)}
              className="mb-3 w-full rounded-xl border border-neutral-300 p-2"
            >
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>

            <button
              onClick={addChapter}
              className="mb-5 w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
            >
              + New Chapter
            </button>

            <div className="mb-4 rounded-xl border-2 border-dashed border-neutral-300 p-4 text-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto max-h-64 rounded-lg object-contain"
                />
              ) : (
                <p className="text-sm text-neutral-500">
                  Upload or take a photo of a book page
                </p>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="mb-3 w-full text-sm"
            />

            <button
              onClick={processMockOCR}
              disabled={!imagePreview || ocrStatus === "processing"}
              className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {ocrStatus === "processing" ? "Processing..." : "Run OCR"}
            </button>

            {ocrStatus === "done" && (
              <p className="mt-3 text-sm text-green-600">
                Text added to chapter.
              </p>
            )}

            <div className="mt-6 rounded-xl bg-neutral-100 p-3 text-sm text-neutral-600">
              <p className="font-medium text-neutral-800">MVP behavior:</p>
              <p>
                Each scan adds OCR text to the selected chapter as one continuous
                document.
              </p>
            </div>
          </section>

          {/* Right Panel */}
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {activeChapter?.title || "Chapter"}
              </h2>

              <p className="text-sm text-neutral-500">
                {activeChapter?.text.length || 0} characters
              </p>
            </div>

            <textarea
              value={activeChapter?.text || ""}
              onChange={(e) => updateActiveChapterText(e.target.value)}
              placeholder="Scanned Chinese text will appear here..."
              className="min-h-[600px] w-full resize-none rounded-xl border border-neutral-300 p-4 leading-8 outline-none focus:border-blue-500"
            />
          </section>
        </div>
      </div>
    </main>
  );
}