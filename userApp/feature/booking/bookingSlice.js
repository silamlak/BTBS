// src/redux/passengerSlice.js

import { createSlice } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  scheduleId: null,
  busId: null,
  adults: 0,
  children: 0,
  passengerData: [], // Stores data for all passengers
  selectedPassengerIndex: 0, // Index of the currently selected passenger
  selectedSeats: {},
  seats: [],
};

const passengerSlice = createSlice({
  name: "passenger",
  initialState,
  reducers: {
    setScheduleId: (state, action) => {
      state.scheduleId = action.payload.id;
    },
    setBusId: (state, action) => {
      state.busId = action.payload.bus_id;
    },
    setPassengerData: (state, action) => {
      state.passengerData = action.payload;
    },
    deletePassengerData: (state, action) => {
      state.passengerData = []
    },
    setSeats: (state, action) => {
      state.seats = action.payload;
    },
    setSelectedPassengerIndex: (state, action) => {
      state.selectedPassengerIndex = action.payload;
    },
    updatePassenger: (state, action) => {
      const { index, field, value } = action.payload;
      state.passengerData[index][field] = value;
    },
    updateSeats: (state, action) => {
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
      // state.selectedSeats = {};
      state.passengerData[passengerIndex].seat = seatNumber;
      state.seats[passengerIndex].seatNo = seatNumber;
    },

    clearAll: (state) => {
      state.scheduleId = null;
      state.busId = null;
      state.adults = 0;
      state.children = 0;
      state.passengerData = []; // Stores data for all passengers
      state.selectedPassengerIndex = 0; // Index of the currently selected passenger
      state.selectedSeats = {};
      state.seats = [];
    },
  },
});

export const {
  setPassengerData,
  setSelectedPassengerIndex,
  updatePassenger,
  setAdults,
  setSeats,
  setScheduleId,
  setBusId,
  setChildren,
  setSelectedSeat,
  clearAll,
  deletePassengerData,
} = passengerSlice.actions;

const persistConfig = {
  key: "passenger_info",
   storage: AsyncStorage,
};

export default persistReducer(persistConfig, passengerSlice.reducer);
