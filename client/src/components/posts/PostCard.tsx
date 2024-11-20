/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

type PostType = {
  post: {
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
};

const PostCard = ({ post }: PostType) => {
  const isAdminRoute = useLocation().pathname.includes("admin");

  return (
    <CardContainer to={`/post/${post._id}`}>
      <img
        src={
          post.image_url ||
          "https://cdn.pixabay.com/photo/2018/02/21/17/36/programming-3170992_1280.png"
        }
        alt="post image"
      />
      <div className="info">
        <h2>{post.title}</h2>
        <p className="content">{post.content}</p>
        <div>
          <p>By {post.author.name}</p>
          <p>{new Date(post.created_at).toLocaleDateString("en-GB")}</p>
          {isAdminRoute && (
            <p>Status: {post.published ? "Published" : "Not Published"}</p>
          )}
        </div>
      </div>
    </CardContainer>
  );
};

const CardContainer = styled(Link)`
  border-radius: 2rem;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
    rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  max-height: 550px;
  display: flex;
  flex-direction: column;

  img {
    object-fit: cover;
    border-radius: 2rem 2rem 0 0;
    aspect-ratio: 16/9;
    max-height: 48%;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
  }

  .content {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
`;

export default PostCard;
