/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import styled from "styled-components";
import Button from "../Button";
import Error from "../Error";

type NewCommentProps = {
  setShowAddComment: React.Dispatch<React.SetStateAction<boolean>>;
  setReloadComments: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewComment = ({
  setShowAddComment,
  setReloadComments,
}: NewCommentProps) => {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ msg: string }[] | null>(null);

  const { id } = useParams();
  const { getAuthHeaders } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      content,
    };

    const apiBaseUrl =
      import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";

    try {
      const response = await fetch(`${apiBaseUrl}/post/${id}/comments`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Check response
      if (!response.ok) {
        const err = await response.json();
        throw err;
      }
      setShowAddComment(false);
      setReloadComments(true);
    } catch (error) {
      if (typeof error === "object" && error !== null && "errors" in error) {
        // Server returned error
        setErrors((error as { errors: { msg: string }[] }).errors);
      } else if (error instanceof TypeError) {
        // Network error
        setErrors([{ msg: "Network or server down, please check connection" }]);
      } else {
        // Unexpected error (All other errors)
        setErrors([
          { msg: "An unexpected error occurred. Please try again later." },
        ]);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {errors && <Error errors={errors} />}
      <StyledCloseIcon onClick={() => setShowAddComment(false)} />
      <label htmlFor="comment">New Comment</label>
      <textarea
        id="comment"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="button">
        <Button value={"submit"} type={"submit"} />
      </div>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
    rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  border: 1px solid #dbdbdb;
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1rem;
  gap: 1rem;
  width: 80%;
  text-align: center;

  label {
    width: 100%;
    text-align: center;
  }

  textarea {
    border: #dbdbdb 1px solid;
    border-radius: 0.5rem;
    height: 4rem;
    padding: 0.5rem;
    &:focus {
      border: #4299e1 1px solid;
    }
  }

  .button {
    display: flex;
    justify-content: center;
  }
`;

const StyledCloseIcon = styled(IoMdCloseCircle)`
  margin-bottom: -2.5rem;
  z-index: 2;
  cursor: pointer;
  color: #ff0000;
  font-size: 1.5rem;
  &:hover {
    color: #cc0000;
  }
`;

export default NewComment;
