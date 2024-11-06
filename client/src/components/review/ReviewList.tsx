import axios from "axios";
import { ChevronFirst, ChevronLast, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

// Define types for Review and Pagination
interface Reviewer {
  _id: string;
  name: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer?: Reviewer;
}

const ReviewList = () => {
  const { book } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]); // Typed reviews state
  const [error, setError] = useState<string>(""); // Error state
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  const [totalPages, setTotalPages] = useState<number>(1); // Total pages state
  const token = Cookies.get("token"); // Get token from cookies

  const limit = 5; // Reviews per page

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/reviews/${book}?page=${currentPage}&limit=${limit}`
        );

        // Check if response.data.reviews is an array before setting it
        if (Array.isArray(response.data.reviews)) {
          setReviews(response.data.reviews);
        } else {
          setReviews([]); // Set an empty array if it's not an array
        }
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setError("Failed to load reviews. Please try again.");
      }
    };

    fetchReviews();
  }, [book, currentPage]);

  const deleteHandle = async (reviewId: string) => {
    // Explicitly type reviewId as string
    // Confirm before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!isConfirmed) {
      // If user cancels, exit the function
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Filter out the deleted review
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId)
      );
    } catch (error: any) {
      console.error(
        "Error deleting Review:",
        error.response ? error.response.data : error.message
      );
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="text-2xl font-semibold mb-4 flex flex-col items-center">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {reviews.map((review) => (
            <div key={review._id} className="w-full p-2">
              {/* Reviewer */}
              <div className="text-md text-gray-700 font-bold flex items-center justify-between">
                <span>{review.reviewer?.name || "Anonymous"}</span>
                <span className="text-red-500 cursor-pointer hover:bg-purple-100 rounded-full p-2">
                  {review?.reviewer?._id === user?._id && (
                    <Trash2 onClick={() => deleteHandle(review._id)} />
                  )}
                </span>
              </div>
              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-1 md:space-y-0 md:space-x-4 mb-2">
                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 text-yellow-500 text-2xl">
                    <span>{"★".repeat(review.rating)}</span>
                    <span className="text-gray-300">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </div>
                  {/* Rating out of 5 */}
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <span className="text-lg font-medium">{review.rating}</span>
                    <span>/5</span>
                  </div>
                </div>
                {/* Localized Date with Style */}
                <span className="text-gray-500 text-sm italic">
                  {new Date(review.createdAt).toLocaleString()}
                </span>
              </div>
              {/* Comment */}
              <p className="text-gray-800 text-base">{review.comment}</p>
            </div>
          ))}
          {/* Pagination Controls */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handlePrevPage}
              className="px-4 py-2 bg-purple-500 text-white rounded-2xl disabled:opacity-50"
              disabled={currentPage === 1}
            >
              <ChevronFirst />
            </button>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-purple-500 text-white rounded-2xl disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              <ChevronLast />
            </button>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Page {currentPage} of {totalPages}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewList;
