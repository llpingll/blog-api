import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import NewComment from "./NewComment";
import styled from "styled-components";
import Button from "../Button";

// eslint-disable-next-line react/prop-types
const Comments = ({ showAddComment, setShowAddComment }) => {
  const [comments, setComments] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const { user } = useAuth();

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
    <CommentsContainer>
      <div>
        {user ? (
          <Button value={"Add Comment"} />
        ) : (
          <p className="links">
            <Link className="link" to={"/login"}>
              Login
            </Link>{" "}
            or{" "}
            <Link className="link" to={"/signup"}>
              create an account
            </Link>{" "}
            to join the conversation.
          </p>
        )}
      </div>
      {comments.length > 0 ? (
        <>
          <h2>{`Comments (${comments.length})`}</h2>
          {comments.map((comment) => (
            <div className="comment" key={comment._id}>
              <p className="user">{comment.user.name}</p>
              <p className="date">
                {new Date(comment.timestamp).toLocaleDateString("en-GB")}
              </p>
              <p>{comment.content}</p>
            </div>
          ))}
        </>
      ) : (
        <h3 className="no-comments">No Comments</h3>
      )}
      {showAddComment && (
        <NewComment
          comments={comments}
          setComments={setComments}
          setShowAddComment={setShowAddComment}
        />
      )}
    </CommentsContainer>
  );
};

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  > div:first-of-type {
    display: flex;
    justify-content: center;
    padding: 1.5rem 0;
    border-top: #dbdbdb 1px solid;
    border-bottom: #dbdbdb 1px solid;
  }

  .links {
    font-size: 1.5rem;
    text-align: center;
  }

  .link {
    color: #4299e1;
  }

  .comment {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
    /* background-color: white; */
    border: 1px solid #dbdbdb;
    border-radius: 1rem;
    padding: 1rem;
    font-size: 1rem;

    .user {
      font-weight: 600;
      font-size: 1.2rem;
    }

    .date {
      color: #a7a7a7;
      margin-bottom: 0.5rem;
    }
  }

  .no-comments {
    text-align: center;
  }
`;

export default Comments;
