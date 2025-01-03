import SingleBookPage from "@/components/SingleBookPage"; 
import axios from "axios";

// Function to fetch book details
export const getBookDetails = async (bookId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/search/${bookId}`
    );
    return response.data.book || null;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
};

// Function to generate metadata for the page (SEO optimization)
export async function generateMetadata({ params }: { params: { book: string } }) {
  const book = await getBookDetails(params.book);

  if (!book) {
    return {
      title: "Book Not Found",
      description: "The requested book could not be found.",
      openGraph: {
        title: "Book Not Found",
        description: "The requested book could not be found.",
        images: [
          {
            url: `/digmark.png`,
            alt: "Book not found",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Book Not Found",
        description: "The requested book could not be found.",
        image: `/digmark.png`,
      },
    };
  }

  // SEO optimized metadata
  return {
    title: `${book.title} - Book Details`,
    description: book.description || `Discover this amazing book titled "${book.title}".`,
    keywords: book.title + ", book, " + (book.genre || "") + ", " + (book.author || ""),
    openGraph: {
      title: book.title,
      description: book.description || `Discover this amazing book titled "${book.title}".`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/${book.coverImage}`,
          alt: `Cover image of ${book.title}`,
        },
      ],
      type: "book",
      book: {
        author: book.author,
        genre: book.genre || "General",
        publishedTime: book.publishedDate || "Unknown",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: book.description || `Discover this amazing book titled "${book.title}".`,
      image: `${process.env.NEXT_PUBLIC_BASE_URL}/${book.coverImage}`,
    },
    // Adding canonical URL to avoid duplicate content
    robots: "index, follow",
    canonical: `/${params.book}`,
  };
}

// BookPage component
export default function BookPage({ params }: { params: { book: string } }) {
  return <SingleBookPage params={params} />;
}
