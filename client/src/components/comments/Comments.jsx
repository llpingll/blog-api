import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import NewComment from "./NewComment";

// eslint-disable-next-line react/prop-types
const Comments = ({ showAddComment, setShowAddComment }) => {
  const [comments, setComments] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const { user } = useAuth();

  const handleAddComment = () => {
    if (user) {
      setShowAddComment(true);
    } else {
      return;
    }
  };

  useEffect(() => {
    const apiBaseUrl =
      import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";

    const getComments = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/post/${id}/comments`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // Check response
        if (!response.ok) {
          const err = await response.json();
          throw err;
        }

        const data = await response.json();
        setComments(data);
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

    getComments();
  }, [id]);

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
    <>
      <div>
        <button onClick={handleAddComment}>
          {user ? "Add comment" : "Login to comment"}
        </button>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id}>
              <p>{comment.user.name}</p>
              <p>{new Date(comment.timestamp).toLocaleDateString("en-GB")}</p>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <div>No Comments</div>
        )}
      </div>
      {showAddComment && (
        <NewComment
          comments={comments}
          setComments={setComments}
          setShowAddComment={setShowAddComment}
        />
      )}
    </>
  );
};

export default Comments;
