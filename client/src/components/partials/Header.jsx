import { useAuth } from "../provider/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import styled from "styled-components";

const Header = () => {
  const [showAccount, setShowAccount] = useState(false);

  const { user, setToken } = useAuth();
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <Nav>
        <Link to={"/"}>
          <Logo>
            <span>Blog</span> API
          </Logo>
        </Link>
        {user && user.type === "admin" && (
          <button onClick={() => navigate("/admin")}>Admin</button>
        )}
      </Nav>
      {!user ? (
        <button onClick={() => navigate("/login")}>Log In</button>
      ) : (
        <button
          className="account-button"
          onClick={() => setShowAccount(!showAccount)}
        >
          Account{showAccount ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>
      )}
      {showAccount && (
        <AccountDetails>
          <UserInfo>
            <p>Signed in as</p>
            <p className="user">{user.name}</p>
            <p>{user.email}</p>
          </UserInfo>
          <hr />
          <div className="logout">
            <button onClick={() => setToken(null)}>Logout</button>
          </div>
        </AccountDetails>
      )}
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  border-bottom: 1px #e2e8f0 solid;
  display: flex;
  justify-content: space-between;
  padding: var(--24px);
  background: white;

  button {
    font-size: var(--16px);
    padding: 1rem;
    border-radius: 0.8rem;
    background-color: blue;
    color: white;
    font-weight: 600;
  }

  .account-button {
    background-color: white;
    border: 2px solid blue;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    color: black;
    font-weight: 500;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: var(--24px);
`;

const Logo = styled.p`
  font-size: var(--32px);
  font-weight: 600;

  span {
    color: blue;
  }
`;

const AccountDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: absolute;
  top: 8rem;
  right: 1.5rem;
  border: 2px grey solid;
  padding: 1.2rem;
  border-radius: var(--24px);
  z-index: 2;
  background-color: white;
  color: ${({ theme }) => theme.colors.grey};

  .logout {
    text-align: center;
  }

  .user {
    font-weight: 700;
    color: black;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export default Header;
