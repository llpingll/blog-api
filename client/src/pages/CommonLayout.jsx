import { Outlet } from "react-router-dom";
import Header from "../components/partials/Header";
import Footer from "../components/partials/Footer";
import styled from "styled-components";

const CommonLayout = () => {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </>
  );
};

const Main = styled.main`
  padding: var(--24px);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default CommonLayout;
