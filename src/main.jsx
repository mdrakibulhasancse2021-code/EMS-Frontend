import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./Router/Router.jsx";
import "./index.css";
import { EMSContext } from "./Context/EMSProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EMSContext>
      <RouterProvider router={router} />
    </EMSContext>
  </StrictMode>
);
