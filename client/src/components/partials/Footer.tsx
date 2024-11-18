import styled from "styled-components";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <FooterDiv>
      <p>||Ping|| © 2024</p>
      <Link href="https://github.com/llpingll">
        <StyledIcon />
      </Link>
    </FooterDiv>
  );
};

const FooterDiv = styled.footer`
  font-size: var(--16px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  gap: 0.6rem;
`;

const Link = styled.a`
  display: flex;
`;

const StyledIcon = styled(FaGithub)`
  color: black;
  font-size: 1.5rem;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: rotate(360deg) scale(1.1);
  }

  &:active {
    color: #666;
  }
`;

export default Footer;
