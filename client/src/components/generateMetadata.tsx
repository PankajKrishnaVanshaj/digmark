import { Metadata } from "next";
import axios from "axios";

export async function generateMetadata({
  params,
}: {
  params: { book: string };
}): Promise<Metadata> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/search/${params.book}`
    );
    const book = response.data.book;

    return {
      title: book ? `${book.title} - Book Details` : "Book Details",
      description:
        book?.description ||
        "Find more about this book, including reviews and suggestions.",
      openGraph: {
        title: book?.title || "Book Details",
        description: book?.description || "Discover the details of the book.",
        url: `https://digmark.pankri.com/${book?._id}`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${book?.coverImage}`,
            alt: book?.title || "Book Cover",
            width: 800,
            height: 600,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: book?.title || "Book Details",
        description:
          book?.description ||
          "Discover this book with reviews and suggestions.",
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${book.coverImage}`,
            alt: `Cover image of ${book.title}`,
          },
        ],
      },
    };
  } catch (err) {
    return {
      title: "Book Details",
      description: "Discover the details of the book.",
      openGraph: {
        title: "Book Details",
        description: "Discover the details of the book.",
        url: `https://digmark.pankri.com/${params.book}`,
      },
      twitter: {
        card: "summary_large_image",
        title: "Book Details",
        description: "Discover this book with reviews and suggestions.",
        images: [
          {
            url: "/digmark.png",
            alt: `digmark`,
          },
        ],
      },
    };
  }
}
