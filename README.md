# Text Scanning Application

A web app for scanning Chinese book pages and building editable chapter documents. Upload or take a photo of a page, run text extraction, and append the result into the selected chapter as one continuous document.

## Features

- Editable document title
- Multiple chapters with renameable titles
- Upload or take a photo of a book page (mobile-friendly)
- Text extraction via Groq vision API
- Editable extracted text per chapter
- Export full document as `.txt`

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Extraction API:** Groq (`qwen/qwen3.6-27b` by default)
- **Backend route:** `app/api/ocr/route.ts`

No database or authentication in this MVP.

## User Flow

1. Set the document title
2. Select or create a chapter (rename it above the text area)
3. Upload or take a photo of a book page
4. Click **Run Extraction**
5. Edit the appended text if needed
6. Export the document as TXT

## Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com/keys)

### Install and run locally

```bash
npm install
```

Create `.env.local` in the project root:

```env
GROQ_API_KEY=your-groq-api-key-here
```

Optional — use a different vision model:

```env
GROQ_OCR_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set **Root Directory** to the repo root (`.` — not a nested folder)
4. Add environment variable: `GROQ_API_KEY`
5. Deploy

See `.env.example` for all supported environment variables.

## Project Structure

```
app/
  page.tsx              # Main page (state and layout)
  api/ocr/route.ts      # Extraction API route
components/
  Header.tsx            # Document title and export
  ChapterSelector.tsx   # Chapter picker
  ScanPanel.tsx         # Image upload and extraction
  TextEditorPanel.tsx   # Chapter title and text editor
lib/
  groqOcr.ts            # Groq vision extraction
  ocr.ts                # Frontend API helper
types/
  index.ts              # Shared TypeScript types
```

## Notes

- Images must be under **4MB** for Groq base64 upload
- Each extraction appends text to the active chapter with a blank line separator
- Keep `.env.local` and any credential files out of git

## License

Private project.
