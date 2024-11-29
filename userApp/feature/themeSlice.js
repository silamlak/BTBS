import { createSlice } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light",
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

const persistConfig = {
  key: "theme",
  storage: AsyncStorage,
};

export default persistReducer(persistConfig, themeSlice.reducer);
