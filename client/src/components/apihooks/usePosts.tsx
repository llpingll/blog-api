/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

type PostType = {
  image_url: string;
  title: string;
  author: {
    name: string;
  };
  created_at: Date;
  published: boolean;
  content: string;
  _id: string;
}[];

const usePosts = () => {
  const [posts, setPosts] = useState<PostType | []>([]);
  const [errors, setErrors] = useState<{ msg: string }[] | null>(null);
  const [loading, setLoading] = useState(true);

  const { getAuthHeaders } = useAuth();
  const isAdminRoute = useLocation().pathname.includes("admin");

  const apiBaseUrl =
    import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";
  const apiPathURL = isAdminRoute ? "/post" : "/post/published";
  const headers = isAdminRoute ? getAuthHeaders() : {};

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}${apiPathURL}`, {
          method: "GET",
          headers,
        });

        // Check response
        if (!response.ok) {
          const err = await response.json();
          throw err;
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        if (typeof error === "object" && error !== null && "errors" in error) {
          // Server returned error
          setErrors((error as { errors: { msg: string }[] }).errors);
        } else if (error instanceof TypeError) {
          // Network error
          setErrors([
            { msg: "Network or server down, please check connection" },
          ]);
        } else {
          // Unexpected error (All other errors)
          setErrors([
            { msg: "An unexpected error occurred. Please try again later." },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  return { posts, errors, loading };
};

export default usePosts;
