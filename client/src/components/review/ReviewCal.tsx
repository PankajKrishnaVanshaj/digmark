import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ReviewCal = () => {
  const { book } = useParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/reviews/cal/${book}`
        );

        // Check if response.data is an array before setting reviews
        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setReviews([]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setError("Failed to load reviews. Please try again.");
      }
    };

    fetchReviews();
  }, [book]);

  // Ensure reviews is an array before using .reduce()
  const totalRating = Array.isArray(reviews)
    ? reviews.reduce(
        (acc, review) =>
          acc + (typeof review.rating === "number" ? review.rating : 0),
        0
      )
    : 0;

  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0; // Avoid NaN

  const numericAverageRating = parseFloat(averageRating.toFixed(1)); // Ensure numeric value with one decimal

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 text-lg font-medium text-primary-700">
      {/* Rating Stars */}
      <div className="flex items-center space-x-1">
        <span className="flex items-center">
          {/* Display full stars */}
          {[...Array(Math.floor(numericAverageRating))].map((_, index) => (
            <span key={index} className="text-yellow-500 text-xl font-semibold">
              ★
            </span>
          ))}
          {/* Display half star if rating has a decimal part */}
          {numericAverageRating % 1 !== 0 && (
            <span className="text-yellow-500 text-xl font-semibold">★</span>
          )}
          {/* Display remaining empty stars */}
          {[...Array(5 - Math.ceil(numericAverageRating))].map((_, index) => (
            <span key={index} className="text-gray-300 text-xl font-semibold">
              ☆
            </span>
          ))}
        </span>
        <span className="text-xl font-semibold ml-2">
          {numericAverageRating}
        </span>
      </div>

      {/* Rating out of 5 */}
      <div className="flex items-center space-x-1 text-sm text-gray-700">
        <span className="hidden md:inline text-base font-medium text-gray-800">
          {numericAverageRating}
        </span>
        <span className="text-gray-600">/5</span>
      </div>

      {/* Total Ratings */}
      <div className="text-sm text-gray-600 font-light">
        {reviews.length} rating{reviews.length !== 1 ? "s" : ""} yet
      </div>
    </div>
  );
};

export default ReviewCal;
