import { Book } from "@/types";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import WishListStatus from "./WishListStatus";

const BookCard = ({ book }: { book: Book }) => {
  const showPDF = (bookPdf: string) => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${bookPdf}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative flex gap-3 border p-1 rounded-lg shadow-md overflow-visible transition-transform transform hover:-translate-y-0.5 hover:shadow-purple-700">
      {/* Book Image */}
      <div className="relative w-36 h-36">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/${book.coverImage}`}
          alt={book.title}
          width={144} // Set explicit dimensions matching `w-36 h-36`
          height={144}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-lg object-cover"
          priority
        />
      </div>

      {/* Book Details */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-md font-semibold line-clamp-3 mt-2 leading-5">
            <Link href={`/${book._id}`} className="hover:underline hover:text-purple-700">
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
            href={`/${book._id}`}
            className="block py-1 px-4 rounded border border-purple-500 text-purple-700 font-medium text-sm hover:bg-purple-500 hover:text-white transition"
            aria-label={`Read more about ${book.title}`}
          >
            Read more
          </Link>

          <div className="flex items-center gap-2">
            <Eye
              onClick={() => showPDF(book.bookPdf)}
              className="cursor-pointer hover:text-purple-700"
              aria-label={`View PDF for ${book.title}`}
            />

            <WishListStatus book={book._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
