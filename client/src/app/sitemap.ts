import axios from "axios";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

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
    url: `https://digmark.pankri.com/${book._id}/book`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.5,
  }));
  return [...bookUrls];
}