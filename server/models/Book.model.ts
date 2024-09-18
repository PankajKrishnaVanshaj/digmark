import mongoose from "mongoose";
import { Book } from "../types/Book.Types";

const bookSchema = new mongoose.Schema<Book>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    bookPdf: {
      type: String,
      requied: true,
    },
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Book>("Book", bookSchema);
