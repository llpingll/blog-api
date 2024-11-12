import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import PostForm from "./PostForm";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image_url, setImageURL] = useState("");
  const [published, setPublished] = useState(false);
  const [errors, setErrors] = useState([]);

  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "content":
        setContent(value);
        break;
      case "image_url":
        setImageURL(value);
        break;
      case "published":
        setPublished(checked);
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      content,
      image_url,
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
    <>
      <PostForm
        values={[
          { name: "title", value: title, type: "text" },
          { name: "content", value: content, type: "textarea" },
          { name: "image_url", value: image_url, type: "url" },
          { name: "published", value: published, type: "checkbox" },
        ]}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        errors={errors}
        form={"new"}
      />
    </>
  );
};

export default NewPost;
