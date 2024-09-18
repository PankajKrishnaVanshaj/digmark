import { NextFunction, Request, Response } from "express"; // Import Request and Response types
import BookModel from "../models/Book.model";
import ReviewModel from "../models/Review.model";
import { AuthRequest } from "../middlewares/authenticate";
import createHttpError from "http-errors";

// Create a new review
export const createReview = async (req: Request, res: Response) => {
  const { rating, comment } = req.body;
  const { bookId } = req.params;

  try {
    // Check if the book exists
    const book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Create the review
    const newReview = new ReviewModel({
      bookId,
      reviewer: (req as AuthRequest).userId,
      rating,
      comment,
    });

    await newReview.save();
    return res
      .status(201)
      .json({ message: "Review created successfully", review: newReview });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all reviews for a specific book with pagination
export const getReviewsByBook = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const page = parseInt(req.query.page as string) || 1; // Default to page 1
  const limit = parseInt(req.query.limit as string) || 5; // Default limit of 5 reviews per page

  try {
    const reviews = await ReviewModel.find({ bookId })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 }) // Sort reviews by creation date in descending order
      .skip((page - 1) * limit) // Skip reviews for previous pages
      .limit(limit); // Limit to the number of reviews per page

    const totalReviews = await ReviewModel.countDocuments({ bookId }); // Total number of reviews for pagination

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    return res.status(200).json({
      reviews,
      totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all reviews for a specific book
export const getReviewsForCal = async (req: Request, res: Response) => {
  const { bookId } = req.params;

  try {
    const reviews = await ReviewModel.find({ bookId }).sort({ createdAt: -1 }); // Sort reviews by creation date in descending order

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update a review
export const updateReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res
      .status(200)
      .json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a review
export const deleteReview = async (
  req: AuthRequest, // Assuming you're using AuthRequest to get userId
  res: Response,
  next: NextFunction
) => {
  const { reviewId } = req.params;

  try {
    // Find the review first
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the logged-in user is the reviewer
    if (review.reviewer.toString() !== req.userId) {
      return next(createHttpError(403, "You cannot delete others' reviews."));
    }

    // Delete the review after ownership is verified
    await ReviewModel.findByIdAndDelete(reviewId);

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
