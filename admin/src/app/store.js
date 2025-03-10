import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "../features/auth/authSlice";
import themeSlice from "./themeSlice";
import orderSlice from "../features/order/orderSlice";
import busOperatorSlice from "../features/busOperator/busOperatorSlice";
import driverSlice from "../features/drivers/driverSlice";
import busSlice from "../features/buses/busSlice";
import tsoSlice from "../features/tso/tsoSlice";
import hrSlice from "../features/hr/hrSlice";
import bookingSlice from "../features/booking/bookingSlice";
import stationSlice from "../features/station/stationSlice";
import routeSlice from "../features/route/routeSlice";
import scheduleSlice from "../features/schedule/scheduleSlice";

import bookSlice from "../features/book/bookSlice";

const persistConfig = {
  key: "root_btbs",
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  order: orderSlice,
  bo: busOperatorSlice,
  driver: driverSlice,
  bus: busSlice,
  tso: tsoSlice,
  hr: hrSlice,
  booking: bookingSlice,
  station: stationSlice,
  route: routeSlice,
  schedule: scheduleSlice,
  book: bookSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
