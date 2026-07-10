import { execFile } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const DEFAULT_VENV_PYTHON = "C:\\paddle-venv\\Scripts\\python.exe";

function resolvePythonCommand(): string {
  if (process.env.PYTHON_PATH) {
    return process.env.PYTHON_PATH;
  }

  if (process.platform === "win32") {
    return DEFAULT_VENV_PYTHON;
  }

  return "python3";
}

export async function runPaddleOcr(imageBuffer: Buffer): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "paddle-ocr-"));
  const imagePath = path.join(tempDir, "image.jpg");
  const scriptPath = path.join(process.cwd(), "scripts", "paddle_ocr.py");
  const pythonCommand = resolvePythonCommand();

  try {
    await fs.writeFile(imagePath, imageBuffer);

    const { stdout, stderr } = await execFileAsync(
      pythonCommand,
      [scriptPath, imagePath],
      { maxBuffer: 10 * 1024 * 1024 }
    );

    const output = stdout.trim();

    if (!output) {
      throw new Error(stderr.trim() || "PaddleOCR returned no output.");
    }

    const parsed = JSON.parse(output) as {
      text?: string;
      error?: string;
    };

    if (parsed.error) {
      throw new Error(parsed.error);
    }

    return parsed.text?.trim() ?? "";
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("ENOENT")) {
        throw new Error(
          `Python was not found at "${pythonCommand}". Set PYTHON_PATH in .env.local or install PaddleOCR: pip install -r scripts/requirements.txt`
        );
      }

      if (error.message.includes("Unexpected token")) {
        throw new Error(
          `PaddleOCR script returned invalid output. Check Python setup and PYTHON_PATH.`
        );
      }
    }

    throw error;
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}
