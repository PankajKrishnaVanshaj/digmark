import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bookModel from "../models/Book.model";

interface QueryParams {
  searchTerm?: string;
  category?: string;
  limit?: string;
  page?: string;
}

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      searchTerm = "",
      category = "",
      limit = "10",
      page = "1",
    }: QueryParams = req.query;

    const decodedCategory = decodeURIComponent(category);
    const pageLimit = parseInt(limit, 10);
    const pageNumber = parseInt(page, 10);

    if (isNaN(pageLimit) || pageLimit <= 0) {
      return next(createHttpError(400, "Invalid limit parameter"));
    }

    if (isNaN(pageNumber) || pageNumber <= 0) {
      return next(createHttpError(400, "Invalid page parameter"));
    }

    const query: Record<string, any> = {};

    // Handle search term
    if (searchTerm.trim()) {
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Handle category filtering
    if (decodedCategory && decodedCategory !== "All") {
      query.category = { $regex: new RegExp(`^${decodedCategory}$`, "i") };
    }

    const [books, totalBooks] = await Promise.all([
      bookModel
        .find(query)
        .populate("author", "name")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageLimit)
        .limit(pageLimit),
      bookModel.countDocuments(query),
    ]);

    res.json({
      message: "Books retrieved successfully",
      books,
      totalBooks,
      pageNumber,
      pageLimit,
    });
  } catch (err) {
    console.error("Error listing books:", err);
    return next(
      createHttpError(
        500,
        "Error listing books: " +
          (err instanceof Error ? err.message : "Unknown error")
      )
    );
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.bookId;

  try {
    const book = await bookModel.findById(bookId).populate("author", "name"); // Populate the author field with only the name

    if (!book) {
      return next(createHttpError(404, "Book not found."));
    }

    res.json({ message: "Book retrieved successfully", book });
  } catch (err: any) {
    console.error("Error getting book:", err);
    return next(createHttpError(500, "Error getting book: " + err.message));
  }
};

const suggestionBooksByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract category from request query
    const { category } = req.query;

    // Log the incoming category for debugging
    console.log("Incoming category:", category);

    // Validate category
    if (!category || typeof category !== "string") {
      return next(
        createHttpError(400, "Category is required and must be a string")
      );
    }

    // Decode and sanitize the category string
    const decodedCategory = decodeURIComponent(category.trim());

    // Log the decoded category for debugging
    console.log("Decoded category:", decodedCategory);

    // Create the query object to match the category
    const query = {
      category: decodedCategory, // Direct match without regex
    };

    // Log the query for debugging
    console.log("Query object:", query);

    // Fetch books based on the decoded category and populate the author field
    const books = await bookModel
      .find(query)
      .populate("author", "name") // Only return the author’s name
      .sort({ createdAt: -1 }); // Sort books by creation date in descending order

    // Log the fetched books for debugging
    console.log("Fetched books:", books);

    // Respond with the books that match the category
    res.json({
      message: `Books retrieved successfully for category: ${decodedCategory}`,
      books,
    });
  } catch (err) {
    console.error("Error finding books by category:", err);
    return next(
      createHttpError(
        500,
        "Error finding books by category: " +
          (err instanceof Error ? err.message : "Unknown error")
      )
    );
  }
};

export { listBooks, getSingleBook, suggestionBooksByCategory };
