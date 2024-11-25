import {configureStore, combineReducers} from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

import counterSlice from '../feature/countSlice'

const persistConfig = {
    key: 'app-root',
    storage
}

const rootReducer = combineReducers({
    counter: counterSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
})

export const persistor = persistStore(store)