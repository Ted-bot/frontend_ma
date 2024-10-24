import { configureStore, applyMiddleware } from "@reduxjs/toolkit"
// import { getAvailableLocations } from "./middleware/locationThunk"
// import userSlice from "./features/users/userSlice.jsx"
import { apiSlice } from "./features/api/apiSlice.jsx"
import locationReducer from "./features/location/locationSlice.jsx"
import notificationReducer from "./features/ui/notificationSlice.jsx"
import authReducer from './features/auth/authSlice.jsx'

export const store = configureStore({
    reducer: {
        auth: authReducer,
    // ui: notificationReducer
        // location: locationReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
        // .prepend(listenerMiddleware.middleware)
        .concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV === 'development',
    trace: true
})

// // Infer the type of `store`
// export const AppStore = typeof store
// // Infer the `AppDispatch` type from the store itself
// export const AppDispatch = typeof store.dispatch
// // Same for the `RootState` type
// export const RootState = ReturnType<typeof store.getState>
// // Export a reusable type for handwritten thunks
// export const AppThunk = {RootState, unknown, Action}


export const AppDispatch = store.dispatch