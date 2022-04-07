import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route as PureRoute,
} from "react-router-dom";

import { Login } from './pages/login/index'
import Route from "./components/privateRoute";

function InnerRoutes(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route exact path="/" type="outter">
          <Login />
        </Route>

        <PureRoute exact path="/*" render={() => <h1>Não encontrado</h1>} />
      </Switch>
    </Router>
  );
}

export default InnerRoutes;
