import React, { ReactNode } from "react";
import { Route, Redirect } from "react-router-dom";

interface IRoute {
  children?: ReactNode;
  exact?: boolean;
  path: string;
  type: "inner" | "outter";
}

function PrivateRoute({ children, type, ...rest }: IRoute): JSX.Element {
  const shouldLoadRoute = (): boolean => {
    if (
      (window.sessionStorage.getItem("token") && type === "inner") ||
      (!window.sessionStorage.getItem("token") && type === "outter")
    ) {
      
      return true;
    } else {
      return false;
    }
  };

  return (
    <Route
      {...rest}
      render={({ location }) =>
        shouldLoadRoute() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/unauthorized",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
