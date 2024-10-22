import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { useParams } from "react-router-dom";
import PostForm from "./PostForm";
import Error from "../Error";

const EditPost = () => {
  const [post, setPost] = useState({
    title: "",
    content: "",
    image_url: "",
    published: false,
  });
  const [getErrors, setGetErrors] = useState(null);
  const [postErrors, setPostErrors] = useState(null);
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
          image_url: data.image_url,
          published: data.published,
        });
      } catch (error) {
        if (error.errors) {
          // Server returned error
          setGetErrors(error.errors);
        } else if (error instanceof TypeError) {
          // Network error
          setGetErrors([
            { msg: "Network or server down, please check connection" },
          ]);
        } else {
          // Unexpected error (All other errors)
          setGetErrors([
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
  if (getErrors) {
    return <Error errors={getErrors} />;
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
        setPostErrors(error.errors);
      } else if (error instanceof TypeError) {
        // Network error
        setPostErrors([
          { msg: "Network or server down, please check connection" },
        ]);
      } else {
        // Unexpected error (All other errors)
        setPostErrors([
          { msg: "An unexpected error occurred. Please try again later." },
        ]);
      }
    }
  };

  return (
    <>
      <PostForm
        values={[
          { name: "title", value: post.title, type: "text" },
          { name: "content", value: post.content, type: "textarea" },
          { name: "image_url", value: post.image_url, type: "url" },
          { name: "published", value: post.published, type: "checkbox" },
        ]}
        handleSubmit={handleSubmit}
        handlechange={handleChange}
        errors={postErrors}
        form={"edit"}
      />
    </>
  );
};

export default EditPost;
