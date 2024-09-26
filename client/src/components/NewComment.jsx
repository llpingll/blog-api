import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useAuth } from "./provider/AuthProvider";

// eslint-disable-next-line react/prop-types
const NewComment = ({ comments, setComments, setShowAddComment }) => {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState(null);

  const { id } = useParams();
  const { getAuthHeaders } = useAuth();

  const handleSubmit = async (e) => {
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

      const newComment = await response.json();
      setComments([newComment, ...comments]);
      setShowAddComment(false);
    } catch (error) {
      if (error.errors) {
        // Server returned error
        setErrors(error.errors);
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
    <div>
      <form onSubmit={handleSubmit}>
        {errors && (
          <div>
            {errors.map((err, index) => (
              <p key={index}>{err.msg}</p>
            ))}
          </div>
        )}
        <IoMdCloseCircle onClick={() => setShowAddComment(false)} />
        <label>
          Comment
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="textarea"
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewComment;
