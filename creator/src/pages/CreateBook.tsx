import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBook, getBookById, updateBook } from "../http/api";

const categories = [
  "Fiction",
  "Non-Fiction",
  "Business & Economics",
  "Health & Fitness",
  "Education & Learning",
  "Science & Technology",
  "Children’s Books",
  "Cookbooks, Food & Wine",
  "Religion & Spirituality",
  "Arts & Photography",
];

const CreateBook: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    coverImage: null as FileList | null,
    bookPdf: null as FileList | null,
    category: categories[0],
  });
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["get book by id", bookId],
    queryFn: () => getBookById(bookId as string),
    staleTime: 10000,
    enabled: !!bookId,
  });

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        description: data.description || "",
        category: data.category || categories[0],
        coverImage: null,
        bookPdf: null,
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setForm({ ...form, [name]: files && files.length > 0 ? files : null });
  };

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      bookId ? updateBook(bookId, formData) : createBook(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      navigate("/dashboard/books");
    },
    onError: (error: Error) => {
      setError(
        error.message || "Failed to submit book. Please try again later."
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      if (form.coverImage) formData.append("coverImage", form.coverImage[0]);
      if (form.bookPdf) formData.append("bookPdf", form.bookPdf[0]);

      mutation.mutate(formData);
      setForm({
        title: "",
        description: "",
        category: categories[0],
        coverImage: null,
        bookPdf: null,
      });
    } catch (error) {
      setError("Failed to submit book. Please try again later.");
    }
  };

  const handleCancel = () => {
    setForm({
      title: "",
      description: "",
      category: categories[0],
      coverImage: null,
      bookPdf: null,
    });
    navigate("/dashboard/books");
  };

  if (isLoading) return <div>Loading book details...</div>;
  if (isError) return <div>Error loading book details</div>;

  return (
    <div className="">
      <div className="w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-300 space-y-6">
        <h2 className="text-center text-4xl font-bold text-gray-800 mb-6">
          {bookId ? "Edit Your Book" : "Create Your Book"}
        </h2>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter book title"
              value={form.title || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-3  gap-6">
            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-medium text-gray-700"
              >
                Cover Image
              </label>
              <input
                type="file"
                name="coverImage"
                id="coverImage"
                accept="image/*"
                className="mt-1 block w-full text-gray-500 border border-gray-300 rounded-md shadow-sm file:bg-indigo-50 file:border-0 file:mr-3 file:py-2 file:px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleFileChange}
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                name="category"
                id="category"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="bookPdf"
                className="block text-sm font-medium text-gray-700"
              >
                Book PDF
              </label>
              <input
                type="file"
                name="bookPdf"
                id="bookPdf"
                accept=".pdf"
                className="mt-1 block w-full text-gray-500 border border-gray-300 rounded-md shadow-sm file:bg-indigo-50 file:border-0 file:mr-3 file:py-2 file:px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              required
              rows={5}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter book description"
              value={form.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              className="w-full bg-gray-300 text-gray-700 py-3 rounded-md shadow hover:bg-gray-400 transition ease-in-out duration-300"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md shadow hover:bg-indigo-700 transition ease-in-out duration-300"
            >
              {bookId ? "Update Book" : "Create Book"}
            </button>
          </div>

          {error && (
            <div className="mt-4 text-red-600 font-semibold">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateBook;
