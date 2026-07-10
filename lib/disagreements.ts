export function markDisagreements(pass1: string, pass2: string): string {
  const lines1 = pass1.split(/\r?\n/);
  const lines2 = pass2.split(/\r?\n/);
  const maxLines = Math.max(lines1.length, lines2.length);
  const disagreements: string[] = [];

  for (let index = 0; index < maxLines; index += 1) {
    const line1 = lines1[index] ?? "";
    const line2 = lines2[index] ?? "";

    if (line1.trim() !== line2.trim()) {
      disagreements.push(
        `Line ${index + 1}:\n  Pass 1: ${line1 || "(empty)"}\n  Pass 2: ${line2 || "(empty)"}`
      );
    }
  }

  if (disagreements.length === 0) {
    return "No line-level disagreements were found between the two PaddleOCR passes.";
  }

  return disagreements.join("\n\n");
}
