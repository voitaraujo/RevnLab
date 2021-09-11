import React from "react";
import Router from "./Router";
import moment from 'moment'
import "moment/locale/pt-br";
import { ThemeProvider, createTheme } from "@material-ui/core";
// import api from './services/api';
import { ptBR } from "@material-ui/data-grid";
import "@fontsource/roboto";

import { PALETTE_RED_PRIMARY, PALETTE_GREY_PRIMARY } from "./assets/colors";

import { ToastyContainer } from "./components/toasty";

function App(): JSX.Element {
  moment.locale("pt-br")

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
