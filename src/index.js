import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "typeface-roboto";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import styled from "styled-components/macro";
import ErrorBoundary from "./components/ErrorBoundary";

const StyledErrorBoundary = styled(ErrorBoundary)`
  height: 100vh;
`;

const theme = createMuiTheme({
  palette: {
    background: {
      default: "#ffffff",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledErrorBoundary>
        <App />
      </StyledErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
