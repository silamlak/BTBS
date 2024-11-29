import {createSlice} from '@reduxjs/toolkit'
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const initialState = {
    user: {},
    token: null
}

export const authSlice = createSlice({
    name: 'authecom',
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload;
        },
        loginData: (state, action) => {
            state.user = action.payload
        },
        logout: (state) => {
            // state.user = null
        },
        logoutUser: (state) => {
            // state.user = null
        }
    }
})

export const { login, logout, loginData, logoutUser } = authSlice.actions;

const persistConfig = {
  key: "user",
  storage,
};

export default persistReducer(persistConfig, authSlice.reducer)