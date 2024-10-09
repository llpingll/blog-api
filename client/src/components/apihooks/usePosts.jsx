/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [errors, setErrors] = useState(null);
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
        if (error.errors) {
          // Server returned error
          setErrors(error.errors);
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
