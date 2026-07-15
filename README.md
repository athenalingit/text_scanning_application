# Text Scanning Application

A web app for scanning Chinese book pages and building editable chapter documents. Upload or take a photo of a page, run text extraction, and append the result into the selected chapter as one continuous document.

## Features

- Editable document title
- Multiple chapters with renameable titles
- Upload or take a photo of a book page (mobile-friendly)
- Three extraction modes via top navigation tabs
- Editable extracted text per chapter
- Export full document as `.txt`
- Shared document state across tabs (chapters and text persist in `localStorage`)

## Tabs

| Tab | Route | What it does |
|-----|-------|--------------|
| **Google Vision** | `/` | Google Cloud Vision OCR only (default) |
| **Scan** | `/scan` | Dual-pass OCR pipeline: image cleaning → PaddleOCR (with Groq vision fallback) → LLM reconciliation via Groq |
| **Compare** | `/compare` | Runs Groq, Claude, GPT, and Google Vision in parallel; pick the best result in a 2×2 grid |

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Scan pipeline:** sharp, PaddleOCR (Python), Groq LLM reconciliation
- **Compare / Google Vision:** Groq, OpenAI, Anthropic, Google Cloud Vision APIs
- **Persistence:** Browser `localStorage` (no database or auth)

## User Flow

1. Set the document title
2. Select or create a chapter (rename it above the text area)
3. Choose a tab: **Google Vision**, **Scan**, or **Compare**
4. Upload or take a photo of a book page
5. Run extraction
6. Edit the appended text if needed
7. Export the document as TXT

## Getting Started

### Prerequisites

- Node.js 18+
- [Groq API key](https://console.groq.com/keys) (required for Scan tab and Compare)
- Python 3.11+ (optional, for PaddleOCR on Scan tab — falls back to Groq vision if unavailable)
- Google Cloud service account with Vision API enabled (for Google Vision tab and Compare)
- OpenAI / Anthropic API keys (optional, for Compare tab only)

### Install and run locally

```bash
npm install
```

Create `.env.local` in the **project root** (next to `package.json`, not in a nested folder):

```env
GROQ_API_KEY=your-groq-api-key-here
GOOGLE_APPLICATION_CREDENTIALS=./app/credentials/google-cloud-key.json.json
```

Place your Google service account JSON at:

```
app/credentials/google-cloud-key.json.json
```

This path is gitignored — do not commit it.

Optional API keys for Compare:

```env
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

### PaddleOCR setup (Scan tab, local only)

Scan uses PaddleOCR when Python is available. On Windows, install into a short-path venv to avoid long-path errors:

```powershell
python -m venv C:\paddle-venv
C:\paddle-venv\Scripts\pip install -r scripts/requirements.txt
```

Then add to `.env.local`:

```env
PYTHON_PATH=C:\paddle-venv\Scripts\python.exe
```

If PaddleOCR is not installed, Scan automatically falls back to Groq vision for both passes.

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See `.env.example` for the full list. Summary:

| Variable | Required for | Description |
|----------|--------------|-------------|
| `GROQ_API_KEY` | Scan, Compare | Groq API key for LLM reconciliation and vision models |
| `GOOGLE_APPLICATION_CREDENTIALS` | Google Vision, Compare (local) | Path to service account JSON file |
| `GOOGLE_CLOUD_CREDENTIALS` | Google Vision, Compare (Vercel) | Full service account JSON on one line |
| `OPENAI_API_KEY` | Compare | OpenAI vision extraction |
| `ANTHROPIC_API_KEY` | Compare | Claude vision extraction |
| `PYTHON_PATH` | Scan (local) | Path to Python with PaddleOCR installed |
| `GROQ_RECONCILE_MODEL` | Scan | Optional; defaults to `qwen/qwen3.6-27b` |

Generate a single-line JSON value for Vercel:

```bash
node scripts/print-google-credentials-env.js
```

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set **Root Directory** to the repo root (`.` — not a nested folder)
4. Add environment variables in the Vercel dashboard:

   | Variable | Value |
   |----------|-------|
   | `GROQ_API_KEY` | Your Groq API key |
   | `GOOGLE_CLOUD_CREDENTIALS` | Full service account JSON (one line) |
   | `OPENAI_API_KEY` | Optional, for Compare |
   | `ANTHROPIC_API_KEY` | Optional, for Compare |

   **Important:** File paths like `GOOGLE_APPLICATION_CREDENTIALS=./app/credentials/...` do **not** work on Vercel because credential files are not deployed. Use `GOOGLE_CLOUD_CREDENTIALS` with inline JSON instead.

5. Redeploy after adding or changing environment variables

**Note:** PaddleOCR requires Python and is not available on standard Vercel serverless. On Vercel, the Scan tab uses Groq vision fallback automatically.

## Project Structure

```
app/
  page.tsx                      # Google Vision tab (default)
  scan/page.tsx                 # Scan tab
  compare/page.tsx              # Compare tab
  api/ocr/route.ts              # Scan pipeline API
  api/ocr/google-vision/route.ts
  api/ocr/compare/route.ts
components/
  Header.tsx
  NavTabs.tsx
  ChapterSelector.tsx
  ScanPanel.tsx
  CompareGrid.tsx
  TextEditorPanel.tsx
hooks/
  useDocument.ts                # Shared chapter state (localStorage)
lib/
  extractPipeline.ts            # Scan: clean → dual OCR → LLM reconcile
  googleVisionOcr.ts
  groqOcr.ts, openaiOcr.ts, claudeOcr.ts
  googleCredentials.ts
  ocr.ts                        # Frontend API helpers
scripts/
  paddle_ocr.py                 # PaddleOCR runner
  requirements.txt
  print-google-credentials-env.js
types/
  index.ts
```

## Notes

- Images are resized client-side before upload (max ~2400px, under 4MB)
- Each extraction appends text to the active chapter with a blank line separator
- Google Vision requires billing enabled on your Google Cloud project
- Keep `.env.local` and credential files out of git
- If env vars seem ignored locally, confirm `.env.local` is next to `package.json`, not in `text_scanning_application/text_scanning_application/`

## License

Private project.
