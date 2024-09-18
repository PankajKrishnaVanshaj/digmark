"use client";
import React from "react";
import BookCard from "@/components/BookCard";
import Loading from "@/components/Loading";
import Banner from "@/components/Banner";
import { useSearchContext } from "@/context/SearchContext";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Home() {
  const {
    books,
    isLoading,
    error,
    pageLimit,
    setPageLimit,
    currentPage,
    setCurrentPage,
  } = useSearchContext();

  // Determine if "Next" button should be disabled
  const isNextDisabled = books?.length < pageLimit;

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  if (isLoading || !books) {
    return <Loading />; // Use Loading component instead of plain text
  }

  if (error) {
    return (
      <div className="text-red-500 text-center max-w-7xl mx-auto mb-10">
        Error fetching books: {error}
      </div>
    );
  }

  return (
    <>
      <Banner />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 max-w-7xl mx-auto mb-10">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
      <div className="flex justify-center gap-5 items-center max-w-7xl mx-auto mb-10">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          aria-label="Previous Page"
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsLeft />
        </button>
        <span className="self-center p-2 rounded-xl border border-purple-500 text-purple-700 font-bold">
          {currentPage}
        </span>
        <button
          onClick={handleNextPage}
          disabled={isNextDisabled}
          aria-label="Next Page"
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsRight />
        </button>
      </div>
    </>
  );
}
