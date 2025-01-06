import axios from "axios";

export const getBookDetails = async (bookId: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/search/${bookId}`
    );
    return response.data.book || null;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
};
