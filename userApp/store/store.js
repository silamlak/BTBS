import {configureStore, combineReducers} from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

import counterReducer from '../feature/countSlice'
import themeReducer from "../feature/themeSlice";

const persistConfig = {
    key: 'app-root',
    storage
}

const rootReducer = combineReducers({
  counter: counterReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
})

export const persistor = persistStore(store)