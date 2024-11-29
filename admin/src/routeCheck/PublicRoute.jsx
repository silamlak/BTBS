import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ element: Component, ...rest }) => {
  const auth = useSelector((state) => state.auth.user);
  return auth ? <Navigate to="/sign-in" /> : <Component {...rest} />;
};


export default PublicRoute;
