import { useState, useEffect } from "react";
import { useAuth } from "../components/provider/AuthProvider";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import Comments from "../components/comments/Comments";
import Button from "../components/Button";

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddComment, setShowAddComment] = useState(false);

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

  // If post is null or undefined, return early
  if (!post) return <div>No Post Found</div>;

  return (
    <PostContainer>
      <img
        src={
          post.image_url ||
          "https://cdn.pixabay.com/photo/2018/02/21/17/36/programming-3170992_1280.png"
        }
        alt="post image"
      />
      <div>
        <h1>{post.title}</h1>
        <p>By {post.author.name}</p>
        <p>{new Date(post.created_at).toLocaleDateString("en-GB")}</p>
        {user && user.type === "admin" && (
          <p>Status: {post.published ? "Published" : "Not Published"}</p>
        )}
      </div>

      <p>{post.content}</p>
      {user && user.type === "admin" && (
        <Link className="edit" to={`/admin/edit/${id}`}>
          <Button value={"Edit"} />
        </Link>
      )}
      <Comments
        showAddComment={showAddComment}
        setShowAddComment={setShowAddComment}
      />
    </PostContainer>
  );
};

const PostContainer = styled.div`
  padding: var(--24px);
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-size: 1.15rem;
  align-self: center;

  img {
    border-radius: 1rem;
    object-fit: cover;
    max-height: 20rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  > div:first-of-type p {
    color: #a7a7a7;
    font-size: 1.2rem;
  }

  .edit {
    align-self: center;
  }
`;

export default PostDetail;
