import { useAuth } from "../components/provider/AuthProvider";

const Home = () => {
  const { token, setToken } = useAuth();

  return (
    <div>
      Home
      {token && <button onClick={() => setToken(null)}></button>}
    </div>
  );
};

export default Home;
