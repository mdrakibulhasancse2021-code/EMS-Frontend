import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "../Layout/MainLayout";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";

import HomePage from "../Pages/HomePage/HomePage";
import Login from "../Pages/Login/Login";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import Register from "../Pages/Register/Register";
import Station from "../Pages/station/Station";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      }, 
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/station",
        element: <Station />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
