import React from "react";
import Router from "./Router";
// import api from './services/api';
import "@fontsource/roboto";

import { ToastyContainer } from "./components/toasty";

function App(): JSX.Element {
  return (
    <>
      <ToastyContainer />
      <Router />
    </>
  );
}

export default App;
