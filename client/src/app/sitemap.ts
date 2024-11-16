import axios from "axios";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetching the data
    const response = await axios.get<{
      books: { _id: string; date: string }[];
    }>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/search/all-books`);

    const books = response.data.books; // Access the books array from the response

    // Ensure it's an array before proceeding
    if (!Array.isArray(books)) {
      console.error("Expected an array, but received:", books);
      return [];
    }

    // Mapping the data to the sitemap format
    const bookUrls = books.map((book) => ({
      url: `https://digmark.pankri.com/${book._id}`,
      lastModified: new Date(book.date).toISOString(), // Use the date field from your response
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));

    return bookUrls;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
