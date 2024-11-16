import axios from "axios";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch book data from your API
    const response = await axios.get<{ _id: string; date: string }[]>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/search/all-books`
    );

    const books = response.data;

    // Ensure that we have an array of books before proceeding
    if (Array.isArray(books)) {
      const bookUrls = books.map((book) => ({
        url: `https://digmark.pankri.com/${book._id}`, // URL for each book
        lastModified: new Date(book.date).toISOString(), // Last modified date
        changeFrequency: "daily" as const, // Change frequency
        priority: 0.6, // Priority of the page
      }));

      // Return the Sitemap array (which is how Next.js expects it in a sitemap)
      return [...bookUrls];
    } else {
      console.error("Expected an array, but received:", books);
      return [];
    }
  } catch (error) {
    console.error("Error fetching book data:", error);
    return [];
  }
}
