import axios from "axios";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch data from API
    const response = await axios.get<{
      books: { _id: string; date: string }[];
    }>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/books`);

    // Validate response structure
    const books = response.data;
    if (!Array.isArray(books)) {
      console.error("Invalid response structure. Expected an array, received:", books);
      return [];
    }

    // Map data to sitemap format
    return books.map((book) => ({
      url: `https://digmark.pankri.com/${book._id}/book`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.5,
    }));
  } catch (err: any) {
    console.error("Error fetching sitemap data:", err.message);
    return [];
  }
}
