"use client";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { useState, useEffect } from "react";

const ScrollButtons = () => {
  const [showUpButton, setShowUpButton] = useState(false);
  const [showDownButton, setShowDownButton] = useState(true);

  const toggleVisibility = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop > 200) {
      setShowUpButton(true);
    } else {
      setShowUpButton(false);
    }

    if (scrollTop + windowHeight < documentHeight - 100) {
      setShowDownButton(true);
    } else {
      setShowDownButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-2 right-2 flex flex-col space-y-2 z-50">
      {showUpButton && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="p-1.5 rounded-xl bg-purple-500 shadow-lg hover:bg-purple-300 transition duration-300 ease-in-out transform hover:-translate-y-2 hover:rotate-12 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          <ChevronsUp size={30} />
        </button>
      )}

      {showDownButton && (
        <button
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          className="p-1.5 rounded-xl bg-purple-500 shadow-lg hover:bg-purple-300 transition duration-300 ease-in-out transform hover:translate-y-2 hover:-rotate-12 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          <ChevronsDown size={30} />
        </button>
      )}
    </div>
  );
};

export default ScrollButtons;
