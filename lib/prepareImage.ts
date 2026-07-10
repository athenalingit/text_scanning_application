const MAX_DIMENSION = 2400;
const JPEG_QUALITY = 0.93;
const MAX_FILE_BYTES = 3.8 * 1024 * 1024;

export async function prepareImageForExtraction(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    return file;
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = JPEG_QUALITY;
  let blob = await canvasToJpeg(canvas, quality);

  while (blob.size > MAX_FILE_BYTES && quality > 0.6) {
    quality -= 0.05;
    blob = await canvasToJpeg(canvas, quality);
  }

  const fileName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], fileName, { type: "image/jpeg" });
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Could not prepare image for extraction."));
      },
      "image/jpeg",
      quality
    );
  });
}
