import { Book } from "@/types";
import { Eye, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import WishListStatus from "./WishListStatus";
import BookPDFViewer from "./BookPDFViewer";

const BookCard = ({ book }: { book: Book }) => {
  const handleShare = async () => {
    const baseUrl = `${window.location.origin}/${book._id}/book`;
    const shareData = {
      title: book.title,
      text: book.description,
      url: baseUrl,
    };

    try {
      if (navigator.share) {
        // Use Web Share API if supported
        await navigator.share(shareData);
      } else {
        // Fallback: Copy the link to clipboard
        await navigator.clipboard.writeText(baseUrl);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred.";
    }
  };

  return (
    <div className="relative flex gap-3 border mx-1 p-1 rounded-lg shadow-md overflow-visible transition-transform transform hover:-translate-y-0.5 hover:shadow-purple-700">
      {/* Book Image */}
      <div className="relative w-36 h-36">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/${book.coverImage}`}
          alt={book.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-lg object-cover"
          priority
        />
      </div>

      {/* Book Details */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-md font-semibold line-clamp-3 mt-2 leading-5">
            <Link
              href={`/${book._id}/book`}
              className="hover:text-purple-700"
              aria-label={`Learn more about the book titled "${book.title}"`}
            >
              {book.title}
            </Link>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            by{" "}
            <span className="font-semibold capitalize">
              {book?.author?.name || "Unknown Author"}
            </span>
          </p>
        </div>

        {/* Actions Section */}
        <div className="flex items-center justify-between mt-3">
          <Link
            href={`/${book._id}/book`}
            className="block py-1 px-4 rounded border border-purple-500 text-purple-700 font-medium text-sm hover:bg-purple-500 hover:text-white transition"
            aria-label={`Read more about ${book.title}`}
          >
            Learn more
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
              aria-label={`Share the book titled "${book.title}"`}
            >
              <Share2 size={22} />
            </button>

            <BookPDFViewer bookPdf={book.bookPdf} />

            <WishListStatus book={book._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
