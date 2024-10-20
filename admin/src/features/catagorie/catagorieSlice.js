// src/redux/passengerSlice.js

import { createSlice } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const initialState = {
  adults: 0,
  children: 0,
  passengerData: [], // Stores data for all passengers
  selectedPassengerIndex: 0, // Index of the currently selected passenger
  selectedSeats: {},
};

const passengerSlice = createSlice({
  name: "passenger",
  initialState,
  reducers: {
    setPassengerData: (state, action) => {
      state.passengerData = action.payload;
    },
    setSelectedPassengerIndex: (state, action) => {
      state.selectedPassengerIndex = action.payload;
    },
    updatePassenger: (state, action) => {
      const { index, field, value } = action.payload;
      state.passengerData[index][field] = value;
    },
    setAdults: (state, action) => {
      state.adults = action.payload;
    },
    setChildren: (state, action) => {
      state.children = action.payload;
    },
    setSelectedSeat(state, action) {
      const { passengerIndex, seatNumber } = action.payload;

      // Ensure selectedSeats object is initialized
      if (!state.selectedSeats) {
        state.selectedSeats = {};
      }

      // Check if the seat is already taken by another passenger
      if (state.selectedSeats[seatNumber] !== undefined) {
        // Seat is already taken
        console.log(
          `Seat ${seatNumber} is already taken by Passenger ${
            state.selectedSeats[seatNumber] + 1
          }`
        );
        return; // Do not proceed with assigning this seat
      }

      // Clear previously assigned seat for this passenger
      for (const [seat, index] of Object.entries(state.selectedSeats)) {
        if (index === passengerIndex) {
          delete state.selectedSeats[seat];
        }
      }

      // Assign new seat to the passenger
      state.selectedSeats[seatNumber] = passengerIndex;
    },
  },
});

export const {
  setPassengerData,
  setSelectedPassengerIndex,
  updatePassenger,
  setAdults,
  setChildren,
  setSelectedSeat,
} = passengerSlice.actions;

const persistConfig = {
  key: "passenger_info",
  storage,
};

export default persistReducer(persistConfig, passengerSlice.reducer);
