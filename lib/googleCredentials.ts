import fs from "fs";
import path from "path";

type GoogleServiceAccountCredentials = Record<string, unknown>;

const DEFAULT_CREDENTIAL_PATHS = [
  "./app/credentials/google-cloud-key.json.json",
  "./app/credentials/google-cloud-key.json",
  "./credentials/google-cloud-key.json.json",
  "./credentials/google-cloud-key.json",
];

function resolveCredentialsPath(credentialsPath: string): string {
  const normalized = credentialsPath.trim().replace(/^\.\//, "");

  return path.isAbsolute(credentialsPath)
    ? credentialsPath
    : path.join(process.cwd(), normalized);
}

function loadCredentialsFromFile(credentialsPath: string): GoogleServiceAccountCredentials {
  const resolvedPath = resolveCredentialsPath(credentialsPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(
      `Google credentials file not found at ${resolvedPath}.`
    );
  }

  return JSON.parse(
    fs.readFileSync(resolvedPath, "utf8")
  ) as GoogleServiceAccountCredentials;
}

function parseInlineCredentials(raw: string): GoogleServiceAccountCredentials | null {
  const trimmed = raw.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed) as GoogleServiceAccountCredentials;
  }

  try {
    const decoded = Buffer.from(trimmed, "base64").toString("utf8");

    if (decoded.trim().startsWith("{")) {
      return JSON.parse(decoded) as GoogleServiceAccountCredentials;
    }
  } catch {
    // Not base64-encoded JSON.
  }

  return null;
}

export function loadGoogleCredentials(): GoogleServiceAccountCredentials {
  const cloudCredentials = process.env.GOOGLE_CLOUD_CREDENTIALS?.trim();

  if (cloudCredentials) {
    const parsed = parseInlineCredentials(cloudCredentials);

    if (parsed) {
      return parsed;
    }

    throw new Error(
      "GOOGLE_CLOUD_CREDENTIALS must be valid JSON (or base64-encoded JSON)."
    );
  }

  const applicationCredentials =
    process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();

  if (applicationCredentials) {
    const parsed = parseInlineCredentials(applicationCredentials);

    if (parsed) {
      return parsed;
    }

    return loadCredentialsFromFile(applicationCredentials);
  }

  for (const credentialsPath of DEFAULT_CREDENTIAL_PATHS) {
    const resolvedPath = resolveCredentialsPath(credentialsPath);

    if (fs.existsSync(resolvedPath)) {
      return loadCredentialsFromFile(credentialsPath);
    }
  }

  throw new Error(
    [
      "Google Cloud credentials are not configured.",
      "Local: set GOOGLE_APPLICATION_CREDENTIALS=./app/credentials/google-cloud-key.json.json in .env.local (next to package.json).",
      "Vercel: file paths do not work because credentials are not deployed. Set GOOGLE_CLOUD_CREDENTIALS to the full service account JSON on one line in the Vercel project Environment Variables, then redeploy.",
    ].join(" ")
  );
}
