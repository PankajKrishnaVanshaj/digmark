import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL, deleteBook, getBooksByAuthor } from "../http/api";
import { Book } from "../types/books";
import { useState } from "react";

const BooksPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Number of books per page

  const { data, isLoading, isError } = useQuery({
    queryKey: ["books", currentPage],
    queryFn: () => getBooksByAuthor(currentPage, limit),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const handleDelete = (bookId: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteMutation.mutate(bookId);
    }
  };

  const handleEdit = (bookId: string) => {
    if (window.confirm("Are you sure you want to edit this book?")) {
      navigate(`/dashboard/books/create/${bookId}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching books</div>;
  }

  const books = data?.books || [];
  const totalPages = data?.totalPages || 1;

  // Function to format date to IST (Indian Standard Time)
  const formatToIST = (date: string) =>
    new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Books</h2>
        <Link
          to="/dashboard/books/create"
          className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Book
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Cover Image
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Clicks
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Create Date
              </th>
              <th
                scope="col"
                className="pr-9 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.length > 0 ? (
              books.map((book: Book) => (
                <tr key={book._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <img
                      src={`${BASE_URL}/${book.coverImage}`}
                      alt={book.title}
                      className="h-10 w-10 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">
                    {book.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {book.clicks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatToIST(book.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(book._id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Pencil className="h-5 w-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No books found for this author.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`py-2 px-4 rounded ${currentPage === 1 ? "bg-gray-200" : "bg-blue-500 text-white hover:bg-blue-700"}`}
        >
          Previous
        </button>
        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`py-2 px-4 rounded ${currentPage === totalPages ? "bg-gray-200" : "bg-blue-500 text-white hover:bg-blue-700"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BooksPage;
