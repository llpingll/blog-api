import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./components/Router";
import { ThemeProvider } from "styled-components";
import Theme from "./utilities/Theme";
import GlobalStyle from "./utilities/GlobalStyle";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  </StrictMode>
);
