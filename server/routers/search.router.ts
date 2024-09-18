import express from "express";
import {
  suggestionBooksByCategory,
  getSingleBook,
  listBooks,
} from "../controllers/search.controller";

const searchRouter = express.Router();

searchRouter.get("/all-books", listBooks); // Lists all books
searchRouter.get("/:bookId", getSingleBook); // Gets a single book by ID
searchRouter.get("/", suggestionBooksByCategory);

export default searchRouter;
