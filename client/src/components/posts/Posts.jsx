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
    <div>
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <p>No Posts Found</p>
      )}
    </div>
  );
};

export default Posts;
