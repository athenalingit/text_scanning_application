/**
 * Prints a single-line JSON value suitable for Vercel GOOGLE_CLOUD_CREDENTIALS.
 * Run: node scripts/print-google-credentials-env.js
 */
const fs = require("fs");
const path = require("path");

const candidates = [
  "app/credentials/google-cloud-key.json.json",
  "app/credentials/google-cloud-key.json",
  "credentials/google-cloud-key.json.json",
];

let credentialsPath = null;

for (const candidate of candidates) {
  const resolved = path.join(process.cwd(), candidate);

  if (fs.existsSync(resolved)) {
    credentialsPath = resolved;
    break;
  }
}

if (!credentialsPath) {
  console.error("No Google credentials file found in app/credentials/ or credentials/");
  process.exit(1);
}

const json = fs.readFileSync(credentialsPath, "utf8").trim();

console.log("Add this to Vercel → Project → Settings → Environment Variables:");
console.log("");
console.log("Name: GOOGLE_CLOUD_CREDENTIALS");
console.log("Value: (paste the line below)");
console.log("");
console.log(json);
