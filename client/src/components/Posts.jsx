import { useState, useEffect } from "react";
import { useAuth } from "./provider/AuthProvider";
import Post from "./Post";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    const apiBaseUrl =
      import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";

    const getPosts = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/post`, {
          method: "GET",
          headers: getAuthHeaders(),
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
  }, [getAuthHeaders]);

  // Return early if there are errors
  if (errors) {
    return (
      <div>
        {errors.map((err, index) => (
          <p key={index}>{err.msg}</p>
        ))}
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;

  return <Post posts={posts} />;
};

export default Posts;
