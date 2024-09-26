import { BASE_URL } from "@/server";
import { Book } from "@/types";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import WishListStatus from "./WishListStatus";

const BookCard = ({ book }: { book: Book }) => {
  const showPDF = (bookPdf: string) => {
    const url = `${BASE_URL}${bookPdf}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const fileUrl = `${BASE_URL}${book.bookPdf}`;
  const fileName = `${book.coverImage}`;

  return (
    <>
      <div className="flex gap-5 border p-0.5 rounded-lg shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg">
        <div className="relative w-36 h-36">
          <Image
            src={`${BASE_URL}${book.coverImage}`}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-lg object-cover"
            priority
          />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-lg font-medium  line-clamp-3 mt-2 leading-5 hover:text-purple-500">
              <Link href={`/${book._id}`}>{book.title}</Link>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              by{" "}
              <span className="font-semibold capitalize">
                {book?.author?.name || "Unknown Author"}
              </span>
            </p>
          </div>
          <div className="flex items-center justify-between mt-4 mr-3 pb-1.5">
            <Link
              href={`/${book._id}`}
              className="block py-1 px-4 rounded border border-purple-500 text-purple-700 font-medium text-sm hover:bg-purple-500 hover:text-white transition"
            >
              Read more
            </Link>
            <Eye onClick={() => showPDF(book.bookPdf)} />
            <WishListStatus book={book._id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BookCard;
