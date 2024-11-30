import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
  const isAuth = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate('/sign-in');
    }
  }, [isAuth, navigate]);

  if (!isAuth) {
    // Returning null because navigation is handled in useEffect
    return null;
  }
  if (
    allowedRoles
      .map((role) => role?.toLowerCase())
      .includes(isAuth?.role?.toLowerCase())
  ) {
    return <Component {...rest} />;
  }

  return <div className="text-3xl text-red-950">Unauthorized Access</div>;
};

export default ProtectedRoute;


