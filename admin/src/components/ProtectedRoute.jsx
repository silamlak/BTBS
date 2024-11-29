import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
  const auth = useSelector((state) => state.auth.user);

  const isAuthorized = auth ? true : false;
// console.log(allowedRoles)
  if (!isAuthorized) {
    return <Navigate to="/signin" />;
  } else if (
    allowedRoles
      .map((role) => role?.toLowerCase())
      .includes(auth?.role_based?.toLowerCase())
  ) {
    return <Component {...rest} />;
  } else {
    return <div className="text-3xl text-red-950">Unauthorized Access</div>;
  }
};

export default ProtectedRoute;