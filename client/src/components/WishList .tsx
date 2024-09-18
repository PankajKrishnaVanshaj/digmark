"use client";
import { Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/server";

interface WishListItem {
  _id: string;
  title: string;
  coverImage: string; // Adjust according to your actual data structure
  bookId: {
    _id: string;
    title: string;
    coverImage: string | null; // Allow null in case coverImage is missing
  }; // Add this structure if `bookId` is part of the item
}

const WishList = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [wishList, setWishList] = useState<WishListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const token = Cookies.get("token");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
      window.addEventListener("keydown", handleKeyPress);

      // Fetch wish list when menu opens
      const fetchWishList = async () => {
        setLoading(true);
        try {
          if (!token) {
            alert("No token found");
            return;
          }

          const response = await axios.get(
            `http://localhost:55555/api/v1/wish-list`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setWishList(response.data.wishList);
        } catch (error) {
          setError("Error fetching wish list");
        } finally {
          setLoading(false);
        }
      };

      fetchWishList();
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen]);

  return (
    <div className="relative z-10" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
      >
        <Heart size={30} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-auto max-h-[calc(100vh-4rem)]">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : error ? (
            <div className="p-4 text-red-500 text-center">{error}</div>
          ) : wishList.length > 0 ? (
            <ul className="p-1 space-y-1">
              {wishList.map((item, index) => (
                <li
                  key={item.bookId?._id || item._id || index} // Ensure bookId exists
                  className="flex items-center space-x-3 bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition duration-150 ease-in-out"
                >
                  {item.bookId?.coverImage ? ( // Check if coverImage exists
                    <Image
                      src={`${BASE_URL}${item.bookId.coverImage}`}
                      alt={item.bookId.title}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center text-gray-500">
                      No Image
                    </div> // Display placeholder if no coverImage
                  )}
                  <Link
                    href={`/${item.bookId?._id || item._id}`} // Ensure bookId exists
                    className="text-purple-600 text-sm hover:underline line-clamp-2  "
                    onClick={() => closeMenu()}
                  >
                    {item.bookId?.title || "Untitled"}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center">No items in wish list</div>
          )}
        </div>
      )}
    </div>
  );
};

export default WishList;
