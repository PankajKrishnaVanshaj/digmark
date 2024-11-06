"use client";
import { useAuth } from "@/context/AuthContext";
import { CircleUserRound, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

const UserInfo = () => {
  const { user } = useAuth();

  console.log(user);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/sign-in";
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
        className="p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <CircleUserRound size={30} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-fit bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4 border-b border-gray-200">
            <div className="text-lg font-semibold text-gray-800">
              {user?.name}
            </div>
            <div className="text-sm text-purple-500">{user?.email}</div>
          </div>
          <div className="p-2 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left text-red-500 hover:bg-red-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <LogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
