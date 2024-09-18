// src/config/multer.ts
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Base upload directory in the root
const baseUploadDirectory = path.join(__dirname, "..", "..", "uploads");

// Ensure the base upload directory exists
if (!fs.existsSync(baseUploadDirectory)) {
  fs.mkdirSync(baseUploadDirectory, { recursive: true });
}

// Define specific directories for different file types
const coverImageDirectory = path.join(baseUploadDirectory, "coverImages");
const bookPdfDirectory = path.join(baseUploadDirectory, "bookPdfs");

// Ensure specific directories exist
if (!fs.existsSync(coverImageDirectory)) {
  fs.mkdirSync(coverImageDirectory, { recursive: true });
}
if (!fs.existsSync(bookPdfDirectory)) {
  fs.mkdirSync(bookPdfDirectory, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = baseUploadDirectory;
    if (file.fieldname === "coverImage") {
      uploadDir = coverImageDirectory;
    } else if (file.fieldname === "bookPdf") {
      uploadDir = bookPdfDirectory;
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to validate file types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.fieldname === "coverImage") {
    // Allow only images
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type for cover image. Only JPEG, PNG, and GIF are allowed."
        )
      );
    }
  } else if (file.fieldname === "bookPdf") {
    // Allow only PDFs
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type for book PDF. Only PDF files are allowed.")
      );
    }
  } else {
    cb(new Error("Unknown file field."));
  }
};

// Create Multer instance with configured storage and file filter
export const upload = multer({
  storage,
  fileFilter,
});
