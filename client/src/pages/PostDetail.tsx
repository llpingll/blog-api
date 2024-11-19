import { useAuth } from "../components/provider/AuthProvider";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import Comments from "../components/comments/Comments";
import Button from "../components/Button";
import useSinglePostWithComments from "../components/apihooks/useSinglePostWithComments";
import Error from "../components/Error";
import Loader from "../components/Loader";

const PostDetail = () => {
  const {
    post,
    postErrors,
    comments,
    setComments,
    commentErrors,
    loading,
    setReloadComments,
  } = useSinglePostWithComments();

  const { user } = useAuth();
  const { id } = useParams();

  // Return early if there are errors
  if (postErrors) {
    return <Error errors={postErrors} />;
  }

  if (loading) return <Loader />;

  // If post is null or undefined, return early
  if (!post) return <div>No Post Found</div>;

  return (
    <PostContainer>
      <img
        src={
          post.image_url ||
          "https://cdn.pixabay.com/photo/2018/02/21/17/36/programming-3170992_1280.png"
        }
        alt="post image"
      />
      <div>
        <h1>{post.title}</h1>
        <p>By {post.author.name}</p>
        <p>{new Date(post.created_at).toLocaleDateString("en-GB")}</p>
        {user && user.type === "admin" && (
          <p>Status: {post.published ? "Published" : "Not Published"}</p>
        )}
      </div>

      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      {user && user.type === "admin" && (
        <Link className="edit" to={`/admin/edit/${id}`}>
          <Button type={"button"} value={"Edit"} />
        </Link>
      )}
      <Comments
        comments={comments}
        setComments={setComments}
        commentErrors={commentErrors}
        loading={loading}
        setReloadComments={setReloadComments}
      />
    </PostContainer>
  );
};

const PostContainer = styled.div`
  padding: var(--24px);
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-size: 1.15rem;
  align-self: center;

  img {
    border-radius: 1rem;
    object-fit: cover;
    max-height: 20rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  > div:first-of-type p {
    color: #a7a7a7;
    font-size: 1.2rem;
  }

  .content {
    white-space: pre-line;
  }

  .edit {
    align-self: center;
  }
`;

export default PostDetail;
