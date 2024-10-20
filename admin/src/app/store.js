import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "../features/auth/authSlice";
import themeSlice from "./themeSlice";
import orderSlice from "../features/order/orderSlice";
import busOperatorSlice from "../features/busOperator/busOperatorSlice";

import catagorieSlice from "../features/catagorie/catagorieSlice";

const persistConfig = {
  key: "root_btbs",
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  order: orderSlice,
  bo: busOperatorSlice,
  catagorie: catagorieSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
