import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./routeCheck/ProtectedRoute";
import PublicRoute from "./routeCheck/PublicRoute";
import Home from "./pages/dashboard/Home";
import Layout from "./routeCheck/Layout";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import NotFound from "./pages/notFound/NotFound";
import ConfirmationPage from "./pages/auth/ConfirmationPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import Order from "./pages/orders/Order";
import SingleOrder from "./pages/singleorder/SingleOrder";
import Booking from "./pages/booking/Booking";
import SearchResult from "./pages/booking/SearchResult";
import PassangerInfo from "./pages/booking/PassangerInfo";
import SingleCatagorie from "./pages/singleCatagorie/SingleCatagorie";
import SingleProduct from "./pages/product/SingleProduct";
import Product from "./pages/product/Product";
import CreateProduct from "./pages/product/CreateProduct";

//bus operator
import BusOperator from "./pages/BO/BusOperator";
import SingleBusOperator from "./pages/BO/SingleBusOperator";
import AddBusOperator from "./pages/BO/AddBusOperator";

//drivers
import Drivers from "./pages/driver/Drivers";
import SingleDriver from "./pages/driver/SingleDriver";
import AddDriver from "./pages/driver/AddDriver";

//buses
import Buses from "./pages/bus/Buses";
import SingleBus from "./pages/bus/SingleBus";
import AddBus from "./pages/bus/AddBus";

//TSO
import Tso from "./pages/tso/Tso";
import AddTso from "./pages/tso/AddTso";
import SingleTso from "./pages/tso/SingleTso";

//HR
import Hr from "./pages/hr/Hr";
import AddHr from "./pages/hr/AddHr";
import SingleHr from "./pages/hr/SingleHr";

//station
import Stations from "./pages/station/Stations";
import AddStation from "./pages/station/AddStation";
import SingleStation from "./pages/station/SingleStation";

//route
import Routes from "./pages/route/Routes";
import AddRoute from "./pages/route/AddRoute";
import SingleRoute from "./pages/route/SingleRoute";

//schedule
import Schedules from "./pages/schedule/Schedules";
import AddSchedule from "./pages/schedule/AddSchedule";
import SingleSchedule from "./pages/schedule/SingleSchedule";

import SeatSelection from "./pages/booking/SeatSelection";
import Payment from "./pages/booking/Payment";
import SearchBooking from "./pages/manageBooking/SearchBooking";
import MyBooking from "./pages/manageBooking/MyBooking";
import BookingSuccess from "./pages/booking/BookingSuccess";
import SignInAdmin from "./pages/auth/SignInAdmin";
import EditSeatInfo from "./pages/manageBooking/EditSeatInfo";
import EditPassengerInfo from "./pages/manageBooking/EditPassengerInfo";
import { useSelector } from "react-redux";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import BoDashboard from "./pages/dashboard/BoDashboard";
import HRDashboard from "./pages/dashboard/HRDashboard";

const App = () => {
  const isAuth = useSelector((state) => state.auth.user);
  const userRole = isAuth?.role?.toLowerCase();

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
          // element: <Home />,
          element: (
            <ProtectedRoute
              element={
                userRole === "admin"
                  ? AdminDashboard
                  : userRole === "hr"
                  ? HRDashboard
                  : userRole === "tso"
                  ? Home
                  : BoDashboard
              }
              allowedRoles={["tso", "hr", "bo", "admin"]}
            />
          ),
        },
        {
          path: "/booking",
          element: <ProtectedRoute element={Booking} allowedRoles={["tso"]} />,
        },
        {
          path: "/search-booking",
          element: (
            <ProtectedRoute element={SearchBooking} allowedRoles={["tso"]} />
          ),
        },
        {
          path: "/my-booking",
          element: (
            <ProtectedRoute element={MyBooking} allowedRoles={["tso"]} />
          ),
        },
        {
          path: "/my-booking/edit/seat",
          element: (
            <ProtectedRoute element={EditSeatInfo} allowedRoles={["tso"]} />
          ),
        },
        {
          path: "/my-booking/edit/passenger",
          element: (
            <ProtectedRoute
              element={EditPassengerInfo}
              allowedRoles={["tso"]}
            />
          ),
        },
        {
          path: "/search",
          element: (
            <ProtectedRoute element={SearchResult} allowedRoles={["tso"]} />
          ),
        },
        {
          path: "/passenger",
          element: (
            <ProtectedRoute element={PassangerInfo} allowedRoles={["tso"]} />
          ),
        },
        {
          path: "/seat",
          element: (
            <ProtectedRoute element={SeatSelection} allowedRoles={["tso"]} />
          ),
        },
        {
          path: "/payment",
          element: <ProtectedRoute element={Payment} allowedRoles={["tso"]} />,
        },
        //bo
        {
          path: "/bus-operator",
          element: (
            <ProtectedRoute element={BusOperator} allowedRoles={["hr"]} />
          ),
        },
        {
          path: "/bus-operator/:id",
          element: (
            <ProtectedRoute element={SingleBusOperator} allowedRoles={["hr"]} />
          ),
        },
        {
          path: "/add-bus-operator",
          element: (
            <ProtectedRoute element={AddBusOperator} allowedRoles={["hr"]} />
          ),
        },
        //driver
        {
          path: "/drivers",
          element: <ProtectedRoute element={Drivers} allowedRoles={["hr"]} />,
        },
        {
          path: "/driver/:id",
          // element: <SingleDriver />,
          element: (
            <ProtectedRoute element={SingleDriver} allowedRoles={["hr"]} />
          ),
        },
        {
          path: "/add-driver",
          element: <ProtectedRoute element={AddDriver} allowedRoles={["hr"]} />,
        },
        //bus
        {
          path: "/buses",
          element: <ProtectedRoute element={Buses} allowedRoles={["hr"]} />,
        },
        {
          path: "/bus/:id",
          element: <ProtectedRoute element={SingleBus} allowedRoles={["hr"]} />,
        },
        {
          path: "/add-bus",
          element: <ProtectedRoute element={AddBus} allowedRoles={["hr"]} />,
        },
        //tso
        {
          path: "/tso",
          element: <ProtectedRoute element={Tso} allowedRoles={["hr"]} />,
        },
        {
          path: "/tso/:id",
          element: <ProtectedRoute element={SingleTso} allowedRoles={["hr"]} />,
        },
        {
          path: "/add-tso",
          element: <ProtectedRoute element={AddTso} allowedRoles={["hr"]} />,
        },
        //hr
        {
          path: "/hr",
          element: <ProtectedRoute element={Hr} allowedRoles={["admin"]} />,
        },
        {
          path: "/hr/:id",
          element: (
            <ProtectedRoute element={SingleHr} allowedRoles={["admin"]} />
          ),
        },
        {
          path: "/add-hr",
          element: <ProtectedRoute element={AddHr} allowedRoles={["admin"]} />,
        },
        //station
        {
          path: "/station",
          element: <ProtectedRoute element={Stations} allowedRoles={["bo"]} />,
        },
        {
          path: "/station/:id",
          element: (
            <ProtectedRoute element={SingleStation} allowedRoles={["bo"]} />
          ),
        },
        {
          path: "/add-station",
          element: (
            <ProtectedRoute element={AddStation} allowedRoles={["bo"]} />
          ),
        },
        //route
        {
          path: "/route",
          element: <ProtectedRoute element={Routes} allowedRoles={["bo"]} />,
        },
        {
          path: "/route/:id",
          element: (
            <ProtectedRoute element={SingleRoute} allowedRoles={["bo"]} />
          ),
        },
        {
          path: "/add-route",
          element: <ProtectedRoute element={AddRoute} allowedRoles={["bo"]} />,
        },
        //schedule
        {
          path: "/schedule",
          element: <ProtectedRoute element={Schedules} allowedRoles={["bo"]} />,
        },
        {
          path: "/schedule/:id",
          element: (
            <ProtectedRoute element={SingleSchedule} allowedRoles={["bo"]} />
          ),
        },
        {
          path: "/add-schedule",
          element: (
            <ProtectedRoute element={AddSchedule} allowedRoles={["bo"]} />
          ),
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
      path: "/sign-in-admin",
      element: (
        // <PublicRoute>
        <SignInAdmin />
      ),
    },
    {
      path: "/booking/success/:id",
      element: (
        // <PublicRoute>
        <BookingSuccess />
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
  return <RouterProvider router={router} />;
};

export default App;
