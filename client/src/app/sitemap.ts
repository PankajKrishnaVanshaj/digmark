import axios from "axios";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Attempting to fetch data
  try {
    const response = await axios.get<{ _id: string; date: string }[]>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/search/all-books`
    );
    const books = response.data;

    // Map the fetched data into the expected sitemap format
    const bookUrls = books.map((book) => ({
      url: `https://digmark.pankri.com/${book._id}`,
      lastModified: new Date(book.date).toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));

    return [...bookUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
