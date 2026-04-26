import { extractLeaseTextFromFileWithGemma } from "./gemini";

const SUPPORTED_MIME_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const EXTENSION_MIME_TYPES: Record<string, string> = {
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function getExtension(fileName: string) {
  const normalized = fileName.toLowerCase();
  const dotIndex = normalized.lastIndexOf(".");

  return dotIndex >= 0 ? normalized.slice(dotIndex) : "";
}

export function getLeaseFileMimeType(file: Express.Multer.File) {
  if (SUPPORTED_MIME_TYPES.has(file.mimetype)) {
    return file.mimetype;
  }

  return EXTENSION_MIME_TYPES[getExtension(file.originalname)] ?? file.mimetype;
}

export function isSupportedLeaseFile(file: Express.Multer.File) {
  return SUPPORTED_MIME_TYPES.has(getLeaseFileMimeType(file));
}

export async function extractTextFromLeaseFile(file: Express.Multer.File) {
  const mimeType = getLeaseFileMimeType(file);

  if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
    throw new Error(`Unsupported file type: ${file.originalname}`);
  }

  if (mimeType.startsWith("text/")) {
    return file.buffer.toString("utf8").trim();
  }

  try {
    return await extractLeaseTextFromFileWithGemma({
      base64Data: file.buffer.toString("base64"),
      mimeType,
      fileName: file.originalname,
    });
  } catch (error) {
    console.error("File text extraction failed:", {
      fileName: file.originalname,
      mimeType,
      size: file.size,
      error,
    });

    throw new Error(
      "Could not read text from this file. Try a clearer screenshot, a PDF with selectable text, or paste the lease text.",
    );
  }
}
