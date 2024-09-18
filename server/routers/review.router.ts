import express from "express";
import {
  createReview,
  getReviewsByBook,
  updateReview,
  deleteReview,
  getReviewsForCal,
} from "../controllers/review.controller"; // Adjust the path accordingly
import authenticate from "../middlewares/authenticate";

const reviewRouter = express.Router();

reviewRouter.post("/:bookId", authenticate, createReview); // Create a review
reviewRouter.get("/:bookId", getReviewsByBook); // Get reviews by book
reviewRouter.get("/cal/:bookId", getReviewsForCal); // Get reviews by book
reviewRouter.put("/:reviewId", authenticate, updateReview); // Update a review
reviewRouter.delete("/:reviewId", authenticate, deleteReview); // Delete a review

export default reviewRouter;
