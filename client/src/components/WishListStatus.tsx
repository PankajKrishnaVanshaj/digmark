import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type WishListStatusProps = {
  book: string;
};

const WishListStatus: React.FC<WishListStatusProps> = ({ book }) => {
  const { user } = useAuth();
  const token = Cookies.get("token");

  const [isInWishList, setIsInWishList] = useState(false);

  useEffect(() => {
    if (user?.wishList) {
      setIsInWishList(
        user?.wishList.some(
          (item) => item.bookId.toString() === book.toString()
        )
      );
    }
  }, [user, book]);

  // useEffect(() => {
  //   const fetchWishListStatus = async () => {
  //     try {
  //       if (!token) {
  //         alert("No token found");
  //         return;
  //       }

  //       const response = await axios.get(
  //         `http://localhost:55555/api/v1/wish-list/${book}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       setIsInWishList(response.data.isInWishList);
  //     } catch (error) {
  //       console.error("Error fetching wish list status:", error);
  //     }
  //   };

  //   if (book) {
  //     fetchWishListStatus();
  //   }
  // }, [book, token]);

  const toggleWishList = async () => {
    try {
      if (!token) {
        alert("Please log in first");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/wish-list/${book}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsInWishList(!isInWishList);
      }
    } catch (error) {
      console.error("Error toggling wish list:", error);
    }
  };

  return (
    <div>
      <button
        onClick={toggleWishList}
        className={`p-2 rounded-full hover:bg-gray-200 ${
          isInWishList ? "text-red-500 " : "text-black"
        } transition-colors duration-200`}
        aria-label={isInWishList ? "Remove from wish list" : "Add to wish list"}
      >
        <Heart size={24} />
      </button>
    </div>
  );
};

export default WishListStatus;
