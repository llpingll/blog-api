import { useState, useEffect } from "react";
import { useAuth } from "../provider/AuthProvider";
import { useParams } from "react-router-dom";

type PostType = {
  image_url: string;
  title: string;
  author: {
    name: string;
  };
  created_at: Date;
  published: boolean;
  content: string;
  _id: string;
};

type CommentsType = {
  content: string;
  post: {
    _id: string;
  };
  timestamp: Date;
  user: {
    name: string;
  };
  _id: string;
}[];

const useSinglePostWithComments = () => {
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentsType | []>([]);
  const [postErrors, setPostErrors] = useState<{ msg: string }[] | null>(null);
  const [commentErrors, setCommentErrors] = useState<{ msg: string }[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [reloadComments, setReloadComments] = useState(false);

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
  }, [id, reloadComments]);

  return {
    post,
    comments,
    setComments,
    postErrors,
    commentErrors,
    loading,
    setReloadComments,
  };
};

export default useSinglePostWithComments;
