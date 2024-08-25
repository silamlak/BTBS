import { createSlice, current } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const initialState = {
  orderData: [],
  max_index: null,
  min_index: 1,
  currentDataId: null,
  currentIndex: null
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orderData = action.payload;
      state.max_index = action.payload.length;
    },

    addOrderDetail: (state, action) => {
      state.currentDataId = action.payload;
      const index = state.orderData.findIndex(
        (item) => item._id === action.payload
      );
      state.currentIndex = index + 1;
    },

    nextOrderDetail: (state) => {
      const maxIndex = state.orderData.length - 1;
      if (state.currentIndex < state.max_index) {
        const { _id } = state.orderData[state.currentIndex]
        state.currentDataId = _id;
        state.currentIndex++;
      }
    },

    prevOrderDetail: (state) => {
      if (state.currentIndex > 1) {
        const { _id } = state.orderData[state.currentIndex - 2];
        state.currentDataId = _id;
        state.currentIndex--;
      }
    },
    deleteFiles: (state, action) => {
      const idsToDelete = action.payload; // Array of IDs to delete
      state.orderData = state.orderData.filter(
        (file) => !idsToDelete.includes(file._id)
      );
    },
  },
});

export const {
  addOrder,
  addOrderDetail,
  prevOrderDetail,
  nextOrderDetail,
  deleteFiles,
} = orderSlice.actions;

const persistConfig = {
  key: "o",
  storage,
};

export default persistReducer(persistConfig, orderSlice.reducer);
