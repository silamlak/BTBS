import {createSlice} from '@reduxjs/toolkit'
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const initialState = {
    user: null,
    token: null
}

export const authSlice = createSlice({
    name: 'authecom',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload
            state.token = action.payload;
        },
        logout: (state) => {
            state.user = null
        }
    }
})

export const {login, logout} = authSlice.actions

const persistConfig = {
  key: "ecoma",
  storage,
};

export default persistReducer(persistConfig, authSlice.reducer)