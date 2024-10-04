import { useAuth } from "./provider/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const Header = () => {
  const [showAccount, setShowAccount] = useState(false);

  const { user, setToken } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <Link to={"/"}>
        <h3>Blog</h3>
      </Link>
      {!user ? (
        <button onClick={() => navigate("/login")}>Log In</button>
      ) : (
        <button onClick={() => setShowAccount(!showAccount)}>
          Account {showAccount ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>
      )}
      {showAccount && (
        <div>
          <div>
            <p>Signed in as</p>
            <p>{user.name}</p>
            <p>{user.email}</p>
          </div>
          <hr />
          <div>
            <button onClick={() => setToken(null)}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
