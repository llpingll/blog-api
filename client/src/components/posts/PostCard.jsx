/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";

const PostCard = ({ post }) => {
  const isAdminRoute = useLocation().pathname.includes("admin");

  return (
    <Link to={`/post/${post._id}`}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <div>
        <p>By {post.author.name}</p>
        <p>
          Created on {new Date(post.created_at).toLocaleDateString("en-GB")}
        </p>
        {isAdminRoute && (
          <p>Status: {post.published ? "Published" : "Not Published"}</p>
        )}
      </div>
    </Link>
  );
};

export default PostCard;
