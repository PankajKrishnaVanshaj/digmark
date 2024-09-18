"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Book } from "@/types"; // Assuming you have a Book type
import axios from "axios";

// Define the shape of the context state
interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  category: string;
  setCategory: (category: string) => void;
  pageLimit: number;
  setPageLimit: (limit: number) => void;
  currentPage: number; // Include currentPage in context
  setCurrentPage: (page: number) => void; // Include setCurrentPage in context
  books: Book[];
  isLoading: boolean;
  error: string | null;
  fetchBooks: () => void;
}

// Create the context with default values
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Create a provider component
export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [pageLimit, setPageLimit] = useState<number>(9); // default limit
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch books based on context state
  const fetchBooks = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:55555/api/v1/search/all-books`,
        {
          params: {
            searchTerm,
            category,
            limit: pageLimit,
            page: currentPage,
          },
        }
      );

      setBooks(response.data.books);
      setError(null); // Clear any previous error
    } catch (error: any) {
      setError(error.message || "Failed to fetch books");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(); // Fetch books when any of the relevant state variables change
  }, [searchTerm, category, pageLimit, currentPage]); // Add currentPage to dependencies

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        category,
        setCategory,
        pageLimit,
        setPageLimit,
        currentPage,
        setCurrentPage,
        books,
        isLoading,
        error,
        fetchBooks,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// Create a custom hook to use the context
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
