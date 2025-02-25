import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bookModel from "../models/Book.model";
import { AuthRequest } from "../middlewares/authenticate";
import userModel from "../models/account.model";
import ReviewModel from "../models/Review.model";

// Define an interface for req.files
interface UploadedFiles {
  coverImage?: Express.Multer.File[];
  bookPdf?: Express.Multer.File[];
}

// Helper function to delete a file if it exists
const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted file: ${filePath}`);
  } else {
    console.error(`File ${filePath} does not exist.`);
  }
};

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, category } = req.body;

  const authReq = req as AuthRequest;
  const userId = authReq.userId || null; // Safely access userId
  const isCreator = authReq.isCreator || false; // Safely access isCreator

  // Input validation
  if (!title || !description) {
    return next(
      createHttpError(400, "Title and description and  are required.")
    );
  }

  if (!userId) {
    return next(createHttpError(401, "Unauthorized access."));
  }

  if (!isCreator) {
    // Remove uploaded files since the user is not authorized to create posts
    const files = req.files as UploadedFiles;

    if (files?.coverImage?.[0]) {
      const coverImagePath = path.resolve(
        __dirname,
        `../../uploads/coverImages/${files.coverImage[0].filename}`
      );
      // console.log(`Removing unauthorized upload: ${coverImagePath}`);
      deleteFile(coverImagePath);
    }

    if (files?.bookPdf?.[0]) {
      const bookPdfPath = path.resolve(
        __dirname,
        `../../uploads/bookPdfs/${files.bookPdf[0].filename}`
      );
      // console.log(`Removing unauthorized upload: ${bookPdfPath}`);
      deleteFile(bookPdfPath);
    }

    return res.status(403).json({
      message: "Forbidden. You are not authorized to create posts.",
    });
  }


  try {
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return next(createHttpError(404, "User not found."));
    }

    const files = (req.files as UploadedFiles) || {};
    let coverImage: string | undefined;
    let bookPdf: string | undefined;

    // Handle coverImage and bookPdf uploads
    if (files.coverImage?.[0]) {
      coverImage = files.coverImage[0].filename;
    }

    if (files.bookPdf?.[0]) {
      bookPdf = files.bookPdf[0].filename;
    }

    const newBook = await bookModel.create({
      title,
      description,
      category,
      author: user._id,
      coverImage,
      bookPdf,
    });

    res
      .status(201)
      .json({ message: "Book created successfully", id: newBook._id });
  } catch (err: any) {
    // Unlink uploaded files if book creation failed
    const files = req.files as UploadedFiles;
    if (files?.coverImage?.[0]) {
      const coverImagePath = path.resolve(
        __dirname,
        `../../uploads/coverImages/${files.coverImage[0].filename}`
      );
      deleteFile(coverImagePath);
    }
    if (files?.bookPdf?.[0]) {
      const bookPdfPath = path.resolve(
        __dirname,
        `../../uploads/bookPdfs/${files.bookPdf[0].filename}`
      );
      deleteFile(bookPdfPath);
    }

    return next(createHttpError(500, "Error creating book: " + err.message));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, category } = req.body;
  const bookId = req.params.bookId;

  if (!title || !description) {
    return next(createHttpError(400, "Title,  and description are required."));
  }

  try {
    const book = await bookModel.findById(bookId);
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // Ensure the book's author matches the user trying to update the book
    if (book.author.toString() !== (req as AuthRequest).userId) {
      return next(createHttpError(403, "You cannot update others' books."));
    }

    const files = (req.files as UploadedFiles) || {};
    const updatedFields: Partial<{
      title: string;
      description: string;
      category: string;
      coverImage: string;
      bookPdf: string;
    }> = {
      title,
      description,
      category,
    };

    if (files?.coverImage?.[0]) {
      // Delete the old cover image
      if (book.coverImage) {
        const oldCoverImagePath = path.resolve(
          __dirname,
          `../../uploads/coverImages/${book.coverImage}`
        );
        deleteFile(oldCoverImagePath);
      }
      updatedFields.coverImage = files.coverImage[0].filename;
    }

    if (files?.bookPdf?.[0]) {
      // Delete the old book PDF
      if (book.bookPdf) {
        const oldBookPdfPath = path.resolve(
          __dirname,
          `../../uploads/bookPdfs/${book.bookPdf}`
        );
        deleteFile(oldBookPdfPath);
      }
      updatedFields.bookPdf = files.bookPdf[0].filename;
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      { _id: bookId },
      updatedFields,
      { new: true }
    );

    res.json({ message: "Book updated successfully", updatedBook });
  } catch (err: any) {
    return next(createHttpError(500, "Error updating book: " + err.message));
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  try {
    const book = await bookModel.findById(bookId);
    if (!book) {
      return next(createHttpError(404, "Book not found."));
    }

    if (book.author.toString() !== (req as AuthRequest).userId) {
      return next(createHttpError(403, "You cannot delete others' books."));
    }

    // Delete cover image and book PDF if they exist
    if (book.coverImage) {
      const coverImagePath = path.resolve(
        __dirname,
        `../../uploads/coverImages/${book.coverImage}`
      );
      deleteFile(coverImagePath);
    }

    if (book.bookPdf) {
      const bookPdfPath = path.resolve(
        __dirname,
        `../../uploads/bookPdfs/${book.bookPdf}`
      );
      deleteFile(bookPdfPath);
    }

    // Remove bookId from all users' wish lists
    await userModel.updateMany(
      { "wishList.bookId": bookId },
      { $pull: { wishList: { bookId: bookId } } }
    );

    // Delete all reviews associated with the book
    await ReviewModel.deleteMany({ bookId: bookId });

    await bookModel.findByIdAndDelete(bookId);
    res.json({ message: "Book deleted successfully" });
  } catch (err: any) {
    return next(createHttpError(500, "Error deleting book: " + err.message));
  }
};

const getBooksByAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const authorId = (req as AuthRequest).userId;

    const totalBooks = await bookModel.countDocuments({ author: authorId });
    const books = await bookModel
      .find({ author: authorId })               // Filter by authorId
      .skip((+page - 1) * +limit)              // Skip the appropriate number of books for pagination
      .limit(+limit)                           // Limit the number of books per page
      .sort({ createdAt: -1 });                // Sort books by creation date in descending order


    if (!books.length) {
      return res.status(404).json({ message: "No books found for this author." });
    }

    res.json({
      message: "Books retrieved successfully",
      books,
      totalPages: Math.ceil(totalBooks / +limit),
    });
  } catch (err: any) {
    next(createHttpError(500, "Error listing books: " + err.message));
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

    res.json(book);
  } catch (err: any) {
    return next(createHttpError(500, "Error getting book: " + err.message));
  }
};


const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find()

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found." });
    }

    res.json(books);
  } catch (err: any) {
    return next(createHttpError(500, "Error listing books: " + err.message));
  }
};

export { createBook, updateBook, getBooksByAuthor, getSingleBook, deleteBook, getAllBooks };
