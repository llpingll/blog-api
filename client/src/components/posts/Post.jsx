import { Link, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Post = ({ posts }) => {
  const isAdminRoute = useLocation().pathname.includes("admin");

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Link to={`/post/${post._id}`} key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div>
              <p>By {post.author.name}</p>
              <p>
                Created on{" "}
                {new Date(post.created_at).toLocaleDateString("en-GB")}
              </p>
              {isAdminRoute && (
                <p>Status: {post.published ? "Published" : "Not Published"}</p>
              )}
            </div>
          </Link>
        ))
      ) : (
        <p>No Posts Found</p>
      )}
    </div>
  );
};

export default Post;
