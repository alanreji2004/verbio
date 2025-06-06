import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Landing from "./components/Landing/Landing"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
])

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)