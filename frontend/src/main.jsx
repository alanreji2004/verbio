import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Landing from "./components/Landing/Landing"
import Login from "./components/Login/Login"
import Signup from "./components/Signup/Signup"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
    {
    path: "/signup",
    element: <Signup />,
  },
])

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)