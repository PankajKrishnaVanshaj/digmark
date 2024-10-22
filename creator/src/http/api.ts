import axios from "axios";
import { Book } from "../types/books";
import Cookies from "js-cookie";

// Base URLs
export const BASE_URL = "http://localhost:55555/"; //`${import.meta.env.VITE_API_URL}`;
const baseURL = `${BASE_URL}api/v1`;

// Create Axios instance
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptor to add token from cookies to headers
api.interceptors.request.use((config) => {
  const token = Cookies.get("token"); // Retrieve token from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add token to headers if present
  }
  return config;
});

// AUTH API
// Login function that also stores token in localStorage
export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/auth/signin", data, {
      withCredentials: true, // Include credentials in the request
    });

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Optionally handle errors further if needed
  }
};

// Register function that also stores token in localStorage
export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/signup", data, {
      withCredentials: true, // Include credentials in the request
    });

    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error; // Optionally handle errors further if needed
  }
};

// Books APIs
// Fetch list of books
export const getBooksByAuthor = async () => {
  try {
    const response = await api.get<{ books: Book[] }>(
      "/books/get-books-by-author"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error fetching books: ${error.message}`);
    } else {
      throw new Error(`Unknown error fetching books: ${error}`);
    }
  }
};

// Create a new book
export const createBook = async (data: FormData) => {
  return api.post("/books/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update a book by its ID
export const updateBook = async (bookId: string, data: FormData) => {
  try {
    const response = await api.put(`/books/${bookId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error updating book: ${error.message}`);
    } else {
      throw new Error(`Unknown error updating book: ${error}`);
    }
  }
};
// Fetch a book by its ID
export const getBookById = async (bookId: string) => {
  try {
    const response = await api.get<Book>(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error fetching book: ${error.message}`);
    } else {
      throw new Error(`Unknown error fetching book: ${error}`);
    }
  }
};
// Delete a book by its ID
export const deleteBook = async (bookId: string) => {
  try {
    await api.delete(`/books/${bookId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error deleting book: ${error.message}`);
    } else {
      throw new Error(`Unknown error deleting book: ${error}`);
    }
  }
};
