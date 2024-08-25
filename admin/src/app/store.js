import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import authSlice from "../features/auth/authSlice";
import themeSlice from './themeSlice'
import orderSlice from '../features/order/orderSlice'
import customerSlice from '../features/customer/customerSlice'

// Define the persist configuration
const persistConfig = {
  key: "root_ecom",
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  order: orderSlice,
  customer: customerSlice,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
});

// Create a persistor
export const persistor = persistStore(store);