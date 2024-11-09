import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  useEffect(() => {
    // Function to retrieve token from URL and store it in localStorage
    const handleGoogleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        // Store the token in localStorage
        localStorage.setItem("token", token);

        // Clear the token from the URL (optional)
        window.history.replaceState({}, document.title, "/");

        // Redirect to dashboard or home page
        window.location.href = "/dashboard/home";
      }
    };

    if (window.location.pathname === "/auth") {
      handleGoogleCallback();
    }
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
