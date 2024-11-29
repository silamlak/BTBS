import React, { useEffect } from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
  const isAuth = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  console.log(isAuth);
  if (!isAuth) {
     return navigate("/sign-in");
   } else if (
     allowedRoles
       .map((role) => role?.toLowerCase())
       .includes(isAuth?.role?.toLowerCase())
   ) {
     return <Component {...rest} />;
   } else {
     return <div className="text-3xl text-red-950">Unauthorized Access</div>;
   }
};

export default ProtectedRoute
