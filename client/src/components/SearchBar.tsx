import { useState, FormEvent } from "react";
import { Search } from "lucide-react"; // Import the Search icon
import { useSearchContext } from "@/context/SearchContext";

const SearchBar: React.FC = () => {
  const { setSearchTerm } = useSearchContext(); // Include searchTerm in context
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSearchTerm(inputValue);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-md"
    >
      <input
        type="text"
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 focus:outline-none transition-all flex items-center justify-center"
      >
        <Search size={24} color="black" />
      </button>
    </form>
  );
};

export default SearchBar;
