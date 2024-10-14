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
      <div className="limiter">
        <Nav>
          <Link to={"/"}>
            <Logo>
              <span>Blog</span> API
            </Logo>
          </Link>
          {user && user.type === "admin" && (
            <>
              <button onClick={() => navigate("/admin")}>Admin</button>
              <button onClick={() => navigate("/admin/new")}>Add Post</button>
            </>
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
              <button
                onClick={() => {
                  setShowAccount(!showAccount);
                  setToken(null);
                }}
              >
                Logout
              </button>
            </div>
          </AccountDetails>
        )}
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  border-bottom: 1px ${({ theme }) => theme.colors.grey} solid;
  background: white;
  display: flex;
  flex-direction: column;

  .limiter {
    display: flex;
    justify-content: space-between;
    padding: var(--16px);
    width: 100%;
    max-width: 1800px;
    align-self: center;
    position: relative; // account-button support

    @media (max-width: 535px) {
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }
  }

  button {
    font-size: var(--16px);
    padding: 1rem;
    border-radius: 0.8rem;
    background-image: linear-gradient(to right, #4299e1, #3182ce, #2b6cb0);
    color: white;
    font-weight: 600;
  }

  .account-button {
    background-color: white;
    background-image: none;
    border: #4299e1 solid 2px;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    color: black;
    font-weight: 500;
    max-width: fit-content;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: var(--24px);
  @media (max-width: 450px) {
    justify-content: center;
    width: 100%;
  }
`;

const Logo = styled.p`
  font-size: var(--32px);
  font-weight: 600;

  span {
    color: #4299e1;
  }
`;

const AccountDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: absolute;
  top: 6rem;
  right: 1.5rem;
  border: 2px ${({ theme }) => theme.colors.grey} solid;
  padding: 1.2rem;
  border-radius: var(--24px);
  z-index: 2;
  background-color: white;
  color: #a7a7a7;

  @media (max-width: 450px) {
    top: 11rem;
  }

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
