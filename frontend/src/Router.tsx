import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route as PureRoute,
} from "react-router-dom";

import Route from "./components/privateRoute";
import AppBar from './components/bottomAppBar'

import Login from "./pages/login";
import Storages from './pages/storages/index'
import Machines from './pages/machines/index'
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
          <Storages />
          <AppBar />
        </Route>
        
        <Route exact path="/maquinaDL/:DL" type="inner">
          <Machines />
          <AppBar />
        </Route>

        <PureRoute exact path="/unauthorized" render={() => <Unauthorized />} />
        <PureRoute exact path="/*" render={() => <NotFound />} />
      </Switch>
    </Router>
  );
}

export default InnerRoutes;
