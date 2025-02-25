"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Book } from "@/types";
import ShareButton from "@/components/ShareButton";
import DownloadButton from "@/components/DownloadButton";
import ReviewForm from "@/components/review/ReviewForm";
import ReviewList from "@/components/review/ReviewList";
import ReviewCal from "@/components/review/ReviewCal";
import FAQ from "@/components/FAQ";
import Suggestion from "@/components/Suggestion";
import WishListStatus from "@/components/WishListStatus";
import axios from "axios";
import BookPDFViewer from "./BookPDFViewer";

interface SingleBookPageProps {
  params: {
    creator: string;
  };
}

const SingleBookPage: React.FC<SingleBookPageProps> = ({ params }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "faq" | "suggestion"
  >("suggestion"); // Default to Suggestion tab

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/search/${params.creator}`
        );
        setBook(response.data.book || null);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the book.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [params.creator]);

  if (isLoading) {
    return <div className="text-center text-lg">Loading book details...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!book) {
    return <div className="text-center text-lg">Book not found.</div>;
  }

  return (
    <div className="py-5 px-2 md:p-5">
      {/* Cover Image and Details */}
      <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-10 mb-10 max-w-4xl mx-auto">
        <div className="relative w-full md:w-1/4 h-80 mb-5 md:mb-0 rounded-md overflow-hidden border-4 border-gray-300 shadow-lg">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${book.coverImage}`}
            alt={`Cover image of ${book.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            className="rounded-md object-cover"
            priority
          />
        </div>

        <div className="flex flex-col items-start space-y-2 md:flex-1">
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-primary-900 leading-none line-clamp-3">
            {book.title}
          </h1>

          {/* Author */}
          <p className="text-lg text-primary-600">
            by{" "}
            <span className="font-semibold capitalize">
              {book.author ? book.author.name : "Unknown"}
            </span>
          </p>
          <p className="font-light leading-3 text-sm">{book?.category}</p>
          {/* Actions */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Share Button */}
            <ShareButton
              url={window.location.href}
              // className="transition-transform transform hover:scale-110"
            />

            {/* Download Button */}
            <DownloadButton
              fileurl={`${process.env.NEXT_PUBLIC_BASE_URL}/pdf/${book.bookPdf}`}
              // className="transition-transform transform hover:scale-110"
            />

            {/* View PDF */}
            <BookPDFViewer bookPdf={book.bookPdf} />

            {/* Add to Favorites */}
            <WishListStatus
              book={params.creator}
              // className="cursor-pointer transition-transform transform hover:scale-110"
              aria-label="Add to Favorites"
            />

            {/* Add Reviews */}
            <ReviewForm
              size={24}
              // className="transition-transform transform hover:scale-110"
              aria-label="Leave a Review"
            />
          </div>

          {/* Rating calculation */}
          <ReviewCal />
        </div>
      </div>

      {/* Tabs for Description, Reviews, FAQ, and Suggestion */}
      <div className="py-6 rounded-md text-primary-800">
        <div className="flex flex-col md:flex-row gap-2 border-gray-300 mb-4">
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === "suggestion"
                ? "bg-purple-100 rounded-md border-primary-600 text-primary-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("suggestion")}
          >
            Suggestion
          </button>
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === "description"
                ? "bg-purple-100 rounded-md border-primary-600 text-primary-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === "reviews"
                ? "bg-purple-100 rounded-md border-primary-600 text-primary-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === "faq"
                ? "bg-purple-100 rounded-md border-primary-600 text-primary-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("faq")}
          >
            FAQ
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "description" && (
          <div>
            <h1 className="text-3xl font-extrabold text-primary-900 ">
              {book.title}
            </h1>
            <p className="text-lg p-2">
              {book.description || "No description available."}
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <ReviewList />
          </div>
        )}

        {activeTab === "faq" && (
          <div>
            <FAQ />
          </div>
        )}

        {activeTab === "suggestion" && (
          <div>{book.category && <Suggestion category={book.category} />}</div>
        )}
      </div>
    </div>
  );
};

export default SingleBookPage;
