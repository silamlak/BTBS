import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  // useEffect(() => {
  // if (isAuth) {
  //   return navigate("/", { replace: true });
  // }
  // }, [navigate, isAuth])
  return children
};

export default ProtectedRoute;
