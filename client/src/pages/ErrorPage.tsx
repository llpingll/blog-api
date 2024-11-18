import { Link } from "react-router-dom";
import styled from "styled-components";

const ErrorPage = () => {
  return (
    <ErrorContainer>
      <Message>Oh no, this route doesn&#39;t exist!</Message>

      <LostLink to="/">
        You can go back to the home page by clicking here, though!
      </LostLink>
    </ErrorContainer>
  );
};

const ErrorContainer = styled.div`
  text-align: center;
  min-height: 100vh;
  padding: 5rem 0;
`;

const Message = styled.h1`
  font-size: 4rem;
  color: black;
`;

const LostLink = styled(Link)`
  font-size: 2.5rem;
  color: black;
`;

export default ErrorPage;
