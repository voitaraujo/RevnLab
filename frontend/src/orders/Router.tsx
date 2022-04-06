import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route as PureRoute,
} from "react-router-dom";

import Route from "./components/privateRoute";

function InnerRoutes(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route exact path="/" type="outter">
          <h1>MAIN</h1>
        </Route>

        <PureRoute exact path="/*" render={() => <h1>Não encontrado</h1>} />
      </Switch>
    </Router>
  );
}

export default InnerRoutes;
