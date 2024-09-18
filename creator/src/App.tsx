import { Navigate, createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import CreateBook from "./pages/CreateBook";
import AuthLayout from "./layouts/AuthLayout";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";

const App = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard/home" />,
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "books",
        element: <BooksPage />,
      },
      {
        path: "books/create/:bookId?",
        element: <CreateBook />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SigninPage />,
      },
      {
        path: "sign-up",
        element: <SignupPage />,
      },
    ],
  },
]);

export default App;
