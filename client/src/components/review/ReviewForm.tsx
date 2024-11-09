"use client";

import { MessagesSquare } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const ReviewForm = ({ size = 24 }) => {
  const { book } = useParams(); // Assuming `bookId` is a parameter in your URL
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0); // Manage rating state
  const [comment, setComment] = useState(""); // Manage comment state
  const [error, setError] = useState(""); // Handle error message
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const toggleOpenClose = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Prepare the data to send
    const reviewData = {
      rating,
      comment,
    };

    try {
      // Post review data to the API with the token in the headers
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/reviews/${book}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in Authorization header
          },
        }
      );

      // Clear the form after successful submission
      setRating(0);
      setComment("");
      toggleOpenClose(); // Optionally close the form
    } catch (error) {
      console.error("Failed to submit review:", error);
      setError("Failed to submit your review. Please try again."); // Set error message
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpenClose}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300 focus:outline-none"
        aria-label={isOpen ? "Close review form" : "Open review form"}
      >
        <MessagesSquare size={size} className="text-black" />
      </button>
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="review-form-title"
          className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 transition-opacity duration-300"
        >
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <button
              type="button"
              onClick={toggleOpenClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              <span className="text-xl">&times;</span>
            </button>
            <h3 id="review-form-title" className="text-2xl font-semibold mb-6">
              Leave a Review
            </h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
            {/* Display error message */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="text-lg font-semibold mr-2">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className={`w-6 h-6 text-2xl flex items-center justify-center cursor-pointer transition-colors ${
                      rating >= star ? "text-yellow-500" : "text-gray-300"
                    }`}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {rating > 0
                  ? `You rated this ${rating} star${rating > 1 ? "s" : ""}`
                  : "Select a rating"}
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-colors"
                rows={5}
                placeholder="Write your review here..."
                value={comment}
                onChange={handleCommentChange}
                aria-required="true"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={toggleOpenClose}
                  className="px-5 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
