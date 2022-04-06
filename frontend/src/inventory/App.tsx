import React from "react";
import Router from "./Router";
import moment from 'moment'
import "moment/locale/pt-br";
import { Provider } from 'react-redux'
import { ThemeProvider, createTheme } from "@material-ui/core";
import { ptBR } from "@material-ui/data-grid";
import "@fontsource/roboto";

import { PALETTE_RED_PRIMARY, PALETTE_GREY_PRIMARY } from "./assets/colors";
import { Store } from './global/store/index'

import { ToastyContainer } from "./components/toasty";

const App = (): JSX.Element => {
  moment.locale("pt-br")

  return (
    <Provider store={Store}>
      <ThemeProvider theme={theme}>
        <ToastyContainer />
        <Router />
      </ThemeProvider>
    </Provider>
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
