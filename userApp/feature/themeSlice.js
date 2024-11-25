import { createSlice } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light", // Default theme
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

const persistConfig = {
  key: "ecoma",
  storage,
};

export default persistReducer(persistConfig, themeSlice.reducer);
