import sharp from "sharp";

export async function cleanImage(imageBuffer: Buffer): Promise<Buffer> {
  return sharp(imageBuffer)
    .rotate()
    .normalize()
    .sharpen()
    .jpeg({ quality: 95 })
    .toBuffer();
}

export async function createEnlargedGreyscaleImage(
  imageBuffer: Buffer
): Promise<Buffer> {
  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width || 1200;
  const targetWidth = Math.min(Math.round(width * 1.5), 2400);

  return sharp(imageBuffer)
    .rotate()
    .greyscale()
    .normalize()
    .resize({ width: targetWidth, withoutEnlargement: false })
    .sharpen()
    .jpeg({ quality: 95 })
    .toBuffer();
}
