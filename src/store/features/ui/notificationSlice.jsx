import { createSlice, current } from "@reduxjs/toolkit"
// import { getAvailableLocations } from "../../middleware/locationThunk"
import { initialUserState } from "../../../js/util/auth"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { GetState, GetCity } from "react-country-state-city/dist/cjs"
import { countryid } from "../../../js/util/auth"
import { getLocalStorageItem, deleteLocalStorageItem, setLocalStorageItem } from "../../../js/util/getUtil"
import { ApiFetch, ApiFetchPostOptions, changeObjKeysToCamelCaseFields } from "../../../js/util/postUtil"
import { ApiFetchGetOptions } from "../../../js/util/getUtil"
import inMemoryJwt from "../../../js/util/inMemoryJwt"
import Notification from "../../../components/ui/notification/Notification"
import { apiSlice } from "../api/apiSlice"
import { createSelector } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'ui',
    initialState:{
        user: {notification: null}, 
        status: 'idle', error: null,
        ui: {notification: null}
    },
    reducers: {
        showNotification(state, action){
            if(action.payload === null) {
                state.ui.notification = null
                return
            }

            state.ui.notification = {
                status: action.payload.status,
                title: action.payload.title,
                message: action.payload.message
            }
        },
       
    }
})

// export const apiSliceWithUsers = apiSlice.injectEndpoints({
//     endpoints: builder => ({
//       getUser: builder.query({
//         query: () => '/users'
//       })
//     })
//   })

// const emptyUsers = []

// export const {useGetUserQuery} = apiSliceWithUsers

// export const selectUsersResult = apiSlice.endpoints.getUser.select()

// export const selectUserById = createSelector(
//     selectUsersResult,
//     userResult => userResult ?? emptyUsers
// )

export const sendUpdateNotification = (payload) => {
    return async (dispatch) => {
        dispatch(userActions.showNotification({
            status: payload.status,
            title: payload.title,
            message: payload.message
        })) 

        
    }
}

// Extract the action creators object and the reducer
const { actions: uiActions, reducer: notificationReducer } = notificationSlice

// Extract and export each action creator by name
export {uiActions}

// Export the reducer, either as a default or named export
export default notificationReducer