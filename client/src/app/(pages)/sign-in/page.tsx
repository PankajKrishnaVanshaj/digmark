"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Redirect if token exists
  useEffect(() => {
    if (token) {
      router.push("/"); // Navigates to the home page
    }
  }, [router, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous error

    if (!email || !password) {
      return setError("Please enter email and password.");
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/signin`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      localStorage.setItem("token", response.data.token);
      // Handle success (e.g., redirect, display message)
      setSuccess("Sign in successful!");
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (error: any) {
      // Handle error response
      setError(
        error.response?.data?.message || "An error occurred during sign-in."
      );
    }
  };

  const googleLogin = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/google`,
      "_self"
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-50 p-8 rounded-lg shadow-xl">
        <h2 className="text-center text-3xl font-extrabold text-black mb-4">
          Sign in to your account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <div className="flex justify-between items-center">
            <div>
              <a
                href="#"
                className="text-sm font-medium text-black hover:text-gray-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Sign in
            </button>
          </div>

          {/* <div className="w-full flex items-center justify-center">
            <button
              onClick={googleLogin}
              className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Sign in with Google
            </button>
          </div> */}

          <div className="text-center text-sm">
            <p className="text-black">Don&apos;t have an account yet?</p>
            <a
              href="sign-up"
              className="font-medium text-black hover:text-gray-500"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
