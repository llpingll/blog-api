import { useState, useEffect } from "react";
import { useAuth } from "../provider/AuthProvider";
import { useParams } from "react-router-dom";

const useSinglePostWithComments = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [postErrors, setPostErrors] = useState(null);
  const [commentErrors, setCommentErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const { getAuthHeaders } = useAuth();

  const apiBaseUrl =
    import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";

  useEffect(() => {
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
        console.log("post set");
        setPost(data);
      } catch (error) {
        if (error instanceof TypeError) {
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
        console.log("comments set");
        setComments(data);
      } catch (error) {
        if (error instanceof TypeError) {
          // Network error
          setCommentErrors([
            { msg: "Network or server down, please check connection" },
          ]);
        } else {
          // Unexpected error (All other errors)
          setCommentErrors([
            { msg: "An unexpected error occurred. Please try again later." },
          ]);
        }
      }
    };

    // Use Promise.all to fetch post and comments in parallel
    const fetchData = async () => {
      await Promise.all([getPost(), getComments()]); // Run both requests in parallel
      setLoading(false); // Stop loading once both are done
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { post, comments, setComments, postErrors, commentErrors, loading };
};

export default useSinglePostWithComments;
