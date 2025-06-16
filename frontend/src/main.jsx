import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
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
import ReactGA from "react-ga4";

ReactGA.initialize("G-9Z4S3ZW72H")

function GA4PageTracker() {
  const location = useLocation()

  React.useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname })
  }, [location])

  return null
}

function withTracking(Component) {
  return function TrackedComponent(props) {
    return (
      <>
        <GA4PageTracker />
        <Component {...props} />
      </>
    );
  };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: withTracking(Landing)(),
  },
  {
    path: "/login",
    element: withTracking(Login)(),
  },
  {
    path: "/signup",
    element: withTracking(Signup)(),
  },
    {
    path: "/home",
    element: withTracking(Home)(),
  },
  {
    path: "/verify-email",
    element: withTracking(VerifyEmail)(),
  },
  {
    path: "/profile",
    element: withTracking(Profile)(),
  },
  {
    path: "/reset-password",
    element: withTracking(ResetPassword)(),
  },
  {
    path: "/edit-profile",
    element: withTracking(EditProfile)(),
  },
  {
    path: "/write-story",
    element:withTracking(WriteBlog)(),
  },
  {
    path: "/blog/:id",
    element: withTracking(ViewBlog)(),
  },
  {
    path: "/user/:id",
    element: withTracking(ViewProfile)(),
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