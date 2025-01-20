import express from "express";
import authenticate from "../middlewares/authenticate";
import { upload } from "../config/multer";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBooksByAuthor,
  getSingleBook,
  updateBook,
} from "../controllers/Book.controller";

const bookRouter = express.Router();

bookRouter.post(
  "/create",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookPdf", maxCount: 1 },
  ]),
  authenticate,
  createBook
);

bookRouter.put(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookPdf", maxCount: 1 },
  ]),
  updateBook
);

bookRouter.delete("/:bookId", authenticate, deleteBook);
bookRouter.get("/get-books-by-author", authenticate, getBooksByAuthor);
bookRouter.get("/:bookId", getSingleBook);
bookRouter.get("/", getAllBooks);

export default bookRouter;
