import { useState, useEffect } from "react";
import { useAuth } from "./provider/AuthProvider";

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
        console.log(data);
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

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div>
              <p>Author: {post.author.name}</p>
              <p>Created at: {new Date(post.created_at).toLocaleString()}</p>
              <p>Status: {post.published ? "Published" : "Not Published"}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No Posts Found</p>
      )}
    </div>
  );
};

export default Posts;
