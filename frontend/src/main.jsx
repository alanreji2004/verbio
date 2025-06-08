import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Landing from "./components/Landing/Landing"
import Login from "./components/Login/Login"
import Signup from "./components/Signup/Signup"
import Home from "./components/Home/Home"
import Profile from "./components/Profile/Profile"
import VerifyEmail from "./components/VerifyEmail/VerifyEmail"


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
    {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
])

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)