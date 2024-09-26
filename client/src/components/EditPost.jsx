import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./provider/AuthProvider";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const [post, setPost] = useState({
    title: "",
    content: "",
    imageURL: "",
    published: false,
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const { getAuthHeaders } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const apiBaseUrl =
    import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";

  useEffect(() => {
    const getPostValues = async () => {
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
        setPost({
          title: data.title,
          content: data.content,
          imageURL: data.imageURL,
          published: data.published,
        });
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

    getPostValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setPost((prevPost) => ({
      ...prevPost,
      [name]: type === "checkbox" ? checked : value, // Correctly handle checkbox
    }));
  };

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
  if (!post) return <div>Post Not Found</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiBaseUrl}/post/${id}`, {
        method: "PUT",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      // Check response
      if (!response.ok) {
        const err = await response.json();
        throw err;
      }

      // Otherwise redirect to homepage
      const updatedPost = await response.json();
      navigate(`/post/${updatedPost._id}`);
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
        <input
          name="title"
          value={post.title}
          onChange={handleChange}
          type="text"
        />
      </label>
      <label>
        content
        <textarea
          name="content"
          value={post.content}
          onChange={handleChange}
          type="textarea"
        />
      </label>
      <label>
        imageURL
        <input
          name="imageURL"
          value={post.imageURL}
          onChange={handleChange}
          type="url"
        />
      </label>
      <label>
        Published
        <input
          name="published"
          checked={post.published}
          onChange={handleChange}
          type="checkbox"
        />
      </label>
      <button type="submit">Post</button>
    </form>
  );
};

export default EditPost;
