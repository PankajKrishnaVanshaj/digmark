import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import { useParams } from "next/navigation";

// Define a type for the Book items with all expected fields
type Book = {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  bookPdf: string;
};

type SuggestionProps = {
  category: string;
};

const Suggestion: React.FC<SuggestionProps> = ({ category }) => {
  const { book } = useParams(); // The ID of the book to be skipped
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BASE_URL
          }/api/v1/search?category=${encodeURIComponent(category)}`
        );

        const data = response.data;

        // Check if data has 'books' array
        if (!Array.isArray(data.books)) {
          throw new Error("Received data is not in the expected format");
        }

        setBooks(data.books);
        setIsLoading(false); // Set loading to false after successful fetch
        setError(null); // Clear any previous error
      } catch (error: any) {
        console.error("Error fetching books:", error);
        setError(error.message || "Failed to fetch books");
        setIsLoading(false); // Set loading to false on error
      }
    };

    fetchBooks();
  }, [category]); // Depend on category if you want to refetch when it changes

  return (
    <div className="">
      {isLoading && <p>Loading suggestions...</p>}
      {!isLoading && !error && books.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 mx-auto mb-10">
          {books
            .filter((currentBook) => currentBook._id !== book) // Skip the book with the matching ID
            .map((filteredBook) => (
              <BookCard key={filteredBook._id} book={filteredBook} />
            ))}
        </div>
      ) : (
        !isLoading && !error && <p>No suggestions available.</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Suggestion;
