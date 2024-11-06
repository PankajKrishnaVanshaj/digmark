"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Define the type for User
type WishListItem = {
  _id?: string; // Assuming _id is optional and can be false
  bookId: string; // ObjectId as a string
};

type User = {
  _id: string;
  name: string;
  email: string;
  wishList: WishListItem[];
};

// Define the context value type
type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to provide auth state to children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data);
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
