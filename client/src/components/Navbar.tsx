"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Categories from "./Categories";
import WaffleMenu from "./WaffleMenu";
import SearchBar from "./SearchBar";
import UserInfo from "./UserInfo";
import WishList from "./WishList ";

const Navbar = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    setToken(savedToken);
  }, []);

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-2 px-6 md:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {/* Logo Section */}
            <div className="relative w-12 h-12">
              <Image
                src="/appicons/digmark.png"
                alt="logo"
                width={48} // Explicit width for proper sizing
                height={48} // Explicit height for proper sizing
                priority // Preload the image for faster rendering
                className="object-contain"
              />
            </div>

            {/* Text Section */}
            <span className="text-2xl font-extrabold mt-[-1rem] text-primary-600 tracking-tight">
              PK DigMark
            </span>
          </Link>
        </div>

        <Categories />

        <div className="flex-grow mx-4 hidden md:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:block">
            <WaffleMenu />
          </span>
          {token ? (
            <div className="flex items-center gap-5">
              <WishList />
              <UserInfo />
            </div>
          ) : (
            <Link href="/sign-in">
              <button className="h-10 ml-8 rounded-md border border-primary-500 px-4 py-2 text-sm font-medium text-primary-500 transition-all hover:border-primary-100 hover:bg-primary-100 active:border-primary-200 active:bg-primary-200">
                Sign in
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
