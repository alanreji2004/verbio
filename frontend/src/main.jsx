import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Landing from "./components/Landing/Landing"
import Login from "./components/Login/Login"
import Signup from "./components/Signup/Signup"
import Home from "./components/Home/Home"
import Profile from "./components/Profile/Profile"
import VerifyEmail from "./components/VerifyEmail/VerifyEmail"
import ResetPassword from "./components/ResetPassword/ResetPassword"
import EditProfile from "./components/EditProfile/EditProfile"
import WriteBlog from "./components/WriteBlog/WriteBlog"
import ViewBlog from "./components/ViewBlog/ViewBlog"
import NotFound from "./components/NotFound/NotFound"
import ViewProfile from "./components/ViewProfile/ViewProfile"


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
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/edit-profile",
    element: <EditProfile />,
  },
  {
    path: "/write-story",
    element: <WriteBlog />,
  },
  {
    path: "/blog/:id",
    element: <ViewBlog />,
  },
  {
    path: "/user/:id",
    element: <ViewProfile />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer position="bottom-center" autoClose={3000}
    style={{ bottom: window.innerWidth < 768 ? '80px' : '10px',
    width:window.innerWidth <768?'300px':'500px',
    left: '50%',
    transform: 'translateX(-50%)',
    }}  />
  </>
)