import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchContext } from "@/context/SearchContext";

const Categories = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const { category, setCategory } = useSearchContext();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
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
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleCategoryClick = (selectedCategory: string) => {
    setCategory(selectedCategory);
    closeMenu();
  };

  const categories = [
    "All",
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

  return (
    <div className="flex-grow text-center relative z-10">
      <span
        className="hidden md:block mb-2 lg:inline-block lg:mb-0 text-gray-700 font-semibold cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
      >
        Categories
        {isOpen ? (
          <ChevronUp className="inline-block ml-1 w-5 h-5" />
        ) : (
          <ChevronDown className="inline-block ml-1 w-5 h-5" />
        )}
      </span>
      {isOpen && (
        <div
          ref={categoryRef}
          className="absolute left-0 mt-2 w-64 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        >
          <div className="flex flex-col py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`p-1.5 mx-1 my-0.5 rounded-xl transition duration-300 hover:bg-gray-200 ${
                  category === cat ? "bg-gray-100 text-black" : "text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
