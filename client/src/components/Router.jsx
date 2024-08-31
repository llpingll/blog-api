import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Posts from "../components/Posts";
import NewPost from "../components/NewPost";
import EditPost from "../components/EditPost";
import PostDetail from "../pages/PostDetail";
import ErrorPage from "../pages/ErrorPage";
import AdminLayout from "../pages/AdminLayout";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <Posts /> },
        { path: "new", element: <NewPost /> },
        { path: "edit/:postId", element: <EditPost /> },
      ],
    },
    {
      path: "/post/:postId",
      element: <PostDetail />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
