/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import NewComment from "./NewComment";
import styled from "styled-components";
import Button from "../Button";
import Loader from "../Loader";
import Error from "../Error";

const Comments = ({
  comments,
  setComments,
  commentErrors,
  loading,
  setReloadComments,
}) => {
  const [showAddComment, setShowAddComment] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  if (commentErrors) {
    return <Error errors={commentErrors} />;
  }

  if (loading) return <Loader />;

  return (
    <CommentsContainer>
      <div>
        {user && showAddComment ? (
          <NewComment
            comments={comments}
            setComments={setComments}
            setShowAddComment={setShowAddComment}
            setReloadComments={setReloadComments}
          />
        ) : user ? (
          <Button
            value={"Add Comment"}
            type={"button"}
            action={() => setShowAddComment(true)}
          />
        ) : (
          <p className="links">
            <Link
              className="link"
              to={"/login"}
              state={{ path: location.pathname }}
            >
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
