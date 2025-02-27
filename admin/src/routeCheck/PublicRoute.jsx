import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth.user);
  return auth ? <Navigate to="/" /> : children;
};

export default PublicRoute;
