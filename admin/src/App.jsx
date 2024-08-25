import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom' 
import ProtectedRoute from './routeCheck/ProtectedRoute'
import PublicRoute from './routeCheck/PublicRoute'
import Home from './pages/dashboard/Home';
import Layout from './routeCheck/Layout';
import Signin from './pages/auth/Signin';
import Signup from './pages/auth/Signup';
import NotFound from './pages/notFound/NotFound';
import ConfirmationPage from './pages/auth/ConfirmationPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import Order from './pages/orders/Order';
import SingleOrder from './pages/singleorder/SingleOrder';
import Catagories from './pages/catagories/Catagories';
import SingleCatagorie from './pages/singleCatagorie/SingleCatagorie';
import SingleProduct from './pages/product/SingleProduct';
import Product from './pages/product/Product';
import CreateProduct from './pages/product/CreateProduct';
import Customer from './pages/customer/Customer';
import SingleCustomer from './pages/customer/SingleCustomer';

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        // <ProtectedRoute>
          <Layout />
        // </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/orders",
          element: <Order />,
        },
        {
          path: "/order/:id",
          element: <SingleOrder />,
        },
        {
          path: "/categorie",
          element: <Catagories />,
        },
        {
          path: "/categorie/:id",
          element: <SingleCatagorie />,
        },
        {
          path: "/product",
          element: <Product />,
        },
        {
          path: "/product/create",
          element: <CreateProduct />,
        },
        {
          path: "/product/:id",
          element: <SingleProduct />,
        },
        {
          path: "/customer",
          element: <Customer />,
        },
        {
          path: "/customer/:id",
          element: <SingleCustomer />,
        },
      ],
    },
    {
      path: "/sign-in",
      element: (
        <PublicRoute>
          <Signin />
        </PublicRoute>
      ),
    },
    {
      path: "/sign-up",
      element: (
        <PublicRoute>
          <Signup />
        </PublicRoute>
      ),
    },
    {
      path: "/reset/password",
      element: (
        <PublicRoute>
          <ResetPasswordPage />
        </PublicRoute>
      ),
    },
    {
      path: "/request/reset",
      element: (
        <PublicRoute>
          <ForgotPasswordPage />
        </PublicRoute>
      ),
    },
    {
      path: "/confirmation",
      element: (
        <PublicRoute>
          <ConfirmationPage />
        </PublicRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App