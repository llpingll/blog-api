import { useState, useEffect } from "react";
import { useAuth } from "../components/provider/AuthProvider";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const { getAuthHeaders, user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const apiBaseUrl =
      import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";

    const getPost = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/post/${id}`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        // Check response
        if (!response.ok) {
          const err = await response.json();
          throw err;
        }

        const data = await response.json();
        // console.log(data);
        setPost(data);
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

    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  console.log("Check errors");

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

  console.log("No errors");

  if (loading) return <div>Loading...</div>;

  console.log("No loading");

  // If post is null or undefined, return early
  if (!post) return <div>No Post Found</div>;

  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div>
        <p>By {post.author.name}</p>
        <p>
          Published on {new Date(post.created_at).toLocaleDateString("en-GB")}
        </p>
        {user && user.type === "admin" && (
          <p>Status: {post.published ? "Published" : "Not Published"}</p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
