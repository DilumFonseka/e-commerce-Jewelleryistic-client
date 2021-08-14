import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "./AuthProvider";

const AuthRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <Route
      render={(props) =>
        currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }
      {...rest}
    />
  );
};

export default AuthRoute;
