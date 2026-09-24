import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const uploadRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../uploads");
fs.mkdirSync(uploadRoot, { recursive: true });

const allowedExtensions = new Set([".pdf", ".doc", ".docx", ".txt", ".rtf", ".png", ".jpg", ".jpeg", ".webp", ".xls", ".xlsx", ".csv", ".zip"]);

const storage = multer.diskStorage({
  destination: uploadRoot,
  filename(req, file, done) {
    const extension = path.extname(file.originalname).toLowerCase();
    done(null, `${randomUUID()}${extension}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter(req, file, done) {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(extension)) {
      const error = new Error("Unsupported file type");
      error.status = 400;
      return done(error);
    }
    done(null, true);
  },
});

export function fileMeta(file) {
  return {
    storageName: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
}

export function storedFilePath(storageName) {
  return path.join(uploadRoot, path.basename(storageName));
}

export function removeStoredFiles(files = []) {
  for (const file of files) {
    if (!file?.storageName) continue;
    fs.rm(storedFilePath(file.storageName), { force: true }, () => {});
  }
}
