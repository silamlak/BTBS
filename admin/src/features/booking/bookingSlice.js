import { createSlice } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const initialState = {
  adults: 0,
  children: 0,
  passengerData: [],
  selectedPassengerIndex: null,
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setAdults: (state, action) => {
      state.adults = action.payload;
    },
    setChildren: (state, action) => {
      state.children = action.payload;
    },
    setPassengerData: (state, action) => {
      state.passengerData = action.payload;
    },
    setSelectedPassengerIndex: (state, action) => {
      state.selectedPassengerIndex = action.payload;
    },
    updatePassenger: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.passengerData[index]) {
        state.passengerData[index][field] = value;
      }
    },
  },
});

// Exporting actions
export const {
  setAdults,
  setChildren,
  setPassengerData,
  setSelectedPassengerIndex,
  updatePassenger,
}= bookingSlice.actions;

// Configure persistence
const persistConfig = {
  key: "booking",
  storage,
};

// Exporting persisted reducer
export default persistReducer(persistConfig, bookingSlice.reducer);
