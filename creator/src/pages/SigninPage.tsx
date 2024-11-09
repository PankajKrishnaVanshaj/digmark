import React, { useEffect, useState } from "react";
import { login } from "../http/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type LoginResponse = {
  token: string;
};

const SignInPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Check for token outside of useEffect
  const token = localStorage.getItem("token");

  // Redirect if token exists
  useEffect(() => {
    if (token) {
      navigate("/dashboard/home");
    }
  }, [navigate, token]); // Ensure that the dependency array is correct

  // Mutation to handle login API call
  const mutation = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem("token", data.token); // Save token in localStorage
        navigate("/dashboard/home");
      }
    },
    onError: () => {
      setError("Login failed. Please check your email and password.");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous error

    if (!email || !password) {
      return setError("Please enter email and password.");
    }

    // Trigger mutation to login
    mutation.mutate({ email, password });
  };

  const googleLogin = () => {
    window.open(`${import.meta.env.VITE_API_URL}/api/v1/auth/google`, "_self");
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

          <div className="w-full flex items-center justify-center">
            <button
              onClick={googleLogin}
              className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Sign in with Google
            </button>
          </div>

          <div className="text-center text-sm">
            <p className="text-black">Don't have an account yet?</p>
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

export default SignInPage;
