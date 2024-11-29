import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import counterReducer from "../feature/countSlice";
import themeReducer from "../feature/themeSlice";
import bookingReducer from '../feature/booking/bookingSlice'

const persistConfig = {
  key: "app-root",
  storage: AsyncStorage, // Use AsyncStorage for React Native
};

const rootReducer = combineReducers({
  counter: counterReducer,
  theme: themeReducer,
  booking: bookingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
