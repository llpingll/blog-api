import styled from "styled-components";
import usePosts from "../apihooks/usePosts";
import PostCard from "./PostCard";

const Posts = () => {
  const { posts, errors, loading } = usePosts();

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

  return (
    <PostsContainer>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p>No Posts Found</p>
        )}
      </div>
    </PostsContainer>
  );
};

const PostsContainer = styled.div`
  max-width: 1600px;
  align-self: center;

  > div {
    padding: var(--24px);
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
    /* max-width: 1600px; */
    /* align-self: center; */

    @media (max-width: 1335px) {
      grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    }

    @media (max-width: 1090px) {
      grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    }
  }
`;

export default Posts;
