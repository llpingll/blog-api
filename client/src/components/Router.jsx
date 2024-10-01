import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Posts from "../components/Posts";
import NewPost from "../components/NewPost";
import EditPost from "../components/EditPost";
import PostDetail from "../pages/PostDetail";
import ErrorPage from "../pages/ErrorPage";
import AdminLayout from "./AdminProtectedRoute";
import AuthProvider from "./provider/AuthProvider";
import CommonLayout from "../pages/CommonLayout";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <CommonLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        { path: "signup", element: <Signup /> },
        { path: "login", element: <Login /> },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <Posts /> },
        { path: "new", element: <NewPost /> },
        { path: "edit/:id", element: <EditPost /> },
      ],
    },
    {
      path: "/post/:id",
      element: <PostDetail />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default Router;
