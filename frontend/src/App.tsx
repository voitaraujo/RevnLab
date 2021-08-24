import React from "react";
import Router from "./Router";
import { ThemeProvider, createTheme } from "@material-ui/core";
// import api from './services/api';
import { ptBR } from "@material-ui/data-grid";
import "@fontsource/roboto";

import { PALETTE_RED_PRIMARY, PALETTE_GREY_PRIMARY } from "./assets/colors";

import { ToastyContainer } from "./components/toasty";

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <ToastyContainer />
      <Router />
    </ThemeProvider>
  );
}

export default App;

const theme = createTheme(
  {
    palette: {
      primary: PALETTE_RED_PRIMARY,
      secondary: PALETTE_GREY_PRIMARY,
    },
  },
  ptBR
);
