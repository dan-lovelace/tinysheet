import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";

import "@silevis/reactgrid/styles.css";
import "./index.css";
import App from "./App";

const theme = createTheme({});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
