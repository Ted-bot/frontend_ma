import { configureStore, applyMiddleware } from "@reduxjs/toolkit"
// import { getAvailableLocations } from "./middleware/locationThunk"
import userSlice from "./features/users/userSlice.jsx"

export const store = configureStore({
    reducer: {
        users: userSlice,
    },
    devTools: process.env.NODE_ENV === 'development',
    trace: true
})


// store.dispatch(getAvailableLocations)