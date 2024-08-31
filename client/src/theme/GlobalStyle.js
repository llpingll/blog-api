import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    word-wrap: break-word;
  }

  html {
    font-size: 62.5%;
    line-height: 1.6;
    min-height: 100%;
    /* Footer & Cart support */
    position: relative;
  }

  body {
    font-family: "Noto Sans", sans-serif;
    font-size: 1.6rem;
    background-color: ${({ theme }) => theme.colors.dark};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.2;
  }

  a {
    text-decoration: none;
  }

  img {
    display: block;
    width: 100%;
  }

  button,
  input,
  textarea {
    border: none;
    outline: none;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
  }

  button {
    cursor: pointer;
  }

  @media (max-width: 1200px) {
    html {
      font-size: 55%;
    }
  }

  @media (max-width: 500px) {
    html {
      font-size: 45%;
    }
  }
`;

export default GlobalStyle;
