import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [published, setPublished] = useState(false);
  const [errors, setErrors] = useState([]);

  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "content":
        setContent(value);
        break;
      case "imageURL":
        setImageURL(value);
        break;
      case "published":
        setPublished(value);
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      content,
      imageURL,
      published,
    };

    const apiBaseUrl =
      import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";

    try {
      const response = await fetch(`${apiBaseUrl}/post`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Check response
      if (!response.ok) {
        const err = await response.json();
        throw err;
      }

      // Otherwise redirect to homepage
      const post = await response.json();
      navigate(`/post/${post._id}`);
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
    <form onSubmit={handleSubmit}>
      {errors && (
        <div>
          {errors.map((err, index) => (
            <p key={index}>{err.msg}</p>
          ))}
        </div>
      )}
      <label>
        name
        <input name="title" value={title} onChange={handleChange} type="text" />
      </label>
      <label>
        content
        <textarea
          name="content"
          value={content}
          onChange={handleChange}
          type="textarea"
        />
      </label>
      <label>
        imageURL
        <input
          name="imageURL"
          value={imageURL}
          onChange={handleChange}
          type="url"
        />
      </label>
      <label>
        Published
        <input
          name="published"
          value={published}
          onChange={handleChange}
          type="checkbox"
        />
      </label>
      <button type="submit">Post</button>
    </form>
  );
};

export default NewPost;
