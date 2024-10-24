import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  // Note: a real app would probably have more complex auth state,
  // but for this example we'll keep things simple
  username: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn(state, action) {
      state.username = action.payload
    },
    userLoggedOut(state) {
      state.username = null
    }
  }
})

export const { userLoggedIn, userLoggedOut } = authSlice.actions

export const selectCurrentUsername = (state) => state.auth.username

export default authSlice.reducer