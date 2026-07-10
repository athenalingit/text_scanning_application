"use client";

import { useRef } from "react";

import type { ExtractionStatus } from "@/types";

type ScanPanelProps = {
  title?: string;
  inputId?: string;
  cameraInputId?: string;
  uploadDescription?: string;
  runButtonLabel?: string;
  processingLabel?: string;
  footer?: React.ReactNode;
  imagePreview: string | null;
  extractionStatus: ExtractionStatus;
  errorMessage: string | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRunExtraction: () => void;
};

export default function ScanPanel({
  title = "Scan",
  inputId = "image-upload",
  cameraInputId = "camera-upload",
  uploadDescription = "Upload or take a photo of a book page",
  runButtonLabel = "Run Extraction",
  processingLabel = "Running extraction...",
  footer,
  imagePreview,
  extractionStatus,
  errorMessage,
  onImageUpload,
  onRunExtraction,
}: ScanPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const isProcessing = extractionStatus === "processing";

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    onImageUpload(event);
    event.target.value = "";
  }

  return (
    <section className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
      <h2 className="mb-3 text-base font-semibold sm:text-lg">{title}</h2>

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="sr-only"
      />

      <input
        ref={cameraInputRef}
        id={cameraInputId}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
        className="sr-only"
      />

      <label
        htmlFor={inputId}
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
            <p className="mt-1 text-sm text-neutral-500">{uploadDescription}</p>
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
        onClick={onRunExtraction}
        disabled={!imagePreview || isProcessing}
        className="min-h-12 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white active:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-300 sm:py-2 sm:hover:bg-blue-700"
      >
        {isProcessing ? processingLabel : runButtonLabel}
      </button>

      {extractionStatus === "error" && errorMessage && (
        <p className="mt-3 text-sm leading-relaxed text-red-600">{errorMessage}</p>
      )}

      {footer ?? (
        <div className="mt-6 rounded-xl bg-neutral-100 p-3 text-sm text-neutral-600">
          <p className="font-medium text-neutral-800">Extraction pipeline</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Image cleaning</li>
            <li>Dual PaddleOCR passes</li>
            <li>Disagreement check + LLM verification</li>
          </ul>
        </div>
      )}
    </section>
  );
}
