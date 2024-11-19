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
import SingleDriver from './pages/driver/SingleDriver'
import AddDriver from './pages/driver/AddDriver'

//buses
import Buses from "./pages/bus/Buses";
import SingleBus from './pages/bus/SingleBus'
import AddBus from './pages/bus/AddBus'

//TSO
import Tso from "./pages/tso/Tso"
import AddTso from "./pages/tso/AddTso"
import SingleTso from "./pages/tso/SingleTso"

//HR
import Hr from "./pages/hr/Hr";
import AddHr from './pages/hr/AddHr'
import SingleHr from './pages/hr/SingleHr'

//station
import Stations from "./pages/station/Stations";
import AddStation from "./pages/station/AddStation";
import SingleStation from "./pages/station/SingleStation";

//route
import Routes from "./pages/route/Routes";
import AddRoute from "./pages/route/AddRoute";
import SingleRoute from "./pages/route/SingleRoute"

//schedule
import Schedules from "./pages/schedule/Schedules";
import AddSchedule from "./pages/schedule/AddSchedule"
import SingleSchedule from "./pages/schedule/SingleSchedule"

import SeatSelection from "./pages/booking/SeatSelection";
import Payment from "./pages/booking/Payment";
import SearchBooking from "./pages/manageBooking/SearchBooking";
import MyBooking from "./pages/manageBooking/MyBooking";

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
          element: <Booking />,
        },
        {
          path: "/search-booking",
          element: <SearchBooking />,
        },
        {
          path: "/my-booking",
          element: <MyBooking />,
        },
        {
          path: "/search",
          element: <SearchResult />,
        },
        {
          path: "/passenger",
          element: <PassangerInfo />,
        },
        {
          path: "/seat",
          element: <SeatSelection />,
        },
        {
          path: "/payment",
          element: <Payment />,
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
        //bo
        {
          path: "/bus-operator",
          element: <BusOperator />,
        },
        {
          path: "/bus-operator/:id",
          element: <SingleBusOperator />,
        },
        {
          path: "/add-bus-operator",
          element: <AddBusOperator />,
        },
        //driver
        {
          path: "/drivers",
          element: <Drivers />,
        },
        {
          path: "/driver/:id",
          element: <SingleDriver />,
        },
        {
          path: "/add-driver",
          element: <AddDriver />,
        },
        //bus
        {
          path: "/buses",
          element: <Buses />,
        },
        {
          path: "/bus/:id",
          element: <SingleBus />,
        },
        {
          path: "/add-bus",
          element: <AddBus />,
        },
        //tso
        {
          path: "/tso",
          element: <Tso />,
        },
        {
          path: "/tso/:id",
          element: <SingleTso />,
        },
        {
          path: "/add-tso",
          element: <AddTso />,
        },
        //hr
        {
          path: "/hr",
          element: <Hr />,
        },
        {
          path: "/hr/:id",
          element: <SingleHr />,
        },
        {
          path: "/add-hr",
          element: <AddHr />,
        },
        //station
        {
          path: "/station",
          element: <Stations />,
        },
        {
          path: "/station/:id",
          element: <SingleStation />,
        },
        {
          path: "/add-station",
          element: <AddStation />,
        },
        //route
        {
          path: "/route",
          element: <Routes />,
        },
        {
          path: "/route/:id",
          element: <SingleRoute />,
        },
        {
          path: "/add-route",
          element: <AddRoute />,
        },
        //schedule
        {
          path: "/schedule",
          element: <Schedules />,
        },
        {
          path: "/schedule/:id",
          element: <SingleSchedule />,
        },
        {
          path: "/add-schedule",
          element: <AddSchedule />,
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
  return <RouterProvider router={router} />;
};

export default App;
