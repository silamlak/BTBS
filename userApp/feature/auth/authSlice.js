import { createSlice } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import AsyncStorage from "@react-native-async-storage/async-storage"; // React Native storage

const initialState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

const persistConfig = {
  key: "user",
  storage: AsyncStorage, // Use AsyncStorage for React Native
};

export default persistReducer(persistConfig, authSlice.reducer);
