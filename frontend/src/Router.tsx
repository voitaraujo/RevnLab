import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route as PureRoute,
} from "react-router-dom";

import Route from "./components/privateRoute";
import Login from "./pages/login";
import NotFound from "./pages/notFound";
import Unauthorized from "./pages/unauthorized";

function InnerRoutes(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route exact path="/" type="outter">
          <Login />
        </Route>
        
        <Route exact path="/inventario" type="inner">
          Dentro
        </Route>

        <PureRoute exact path="/unauthorized" render={() => <Unauthorized />} />
        <PureRoute exact path="/*" render={() => <NotFound />} />
      </Switch>
    </Router>
  );
}

export default InnerRoutes;
