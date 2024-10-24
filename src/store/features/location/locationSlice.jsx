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

const LOCATIONS_URL = '/api/locations'

export const getAvailableLocations = createAsyncThunk(
    '/api/getLocation', 
    async (id) => {
        try {
            let getCities = []
            const getStates = await GetState(countryid) // countryid
            if(id) getCities = await GetCity(countryid, id)
                return { getStates, getCities}
        } catch (err) {
            console.log({'locationSlice.js: - nr.19 - getLocation': err})
            return err.message
        }
})

const initialStoreState = {
    city_list: [],
    state_list: []
}

const locationSlice = createSlice({
    name: 'locations',
    initialState:{
        location: {...initialStoreState}, 
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
    },
    extraReducers: builder => {
        builder
            .addCase(getAvailableLocations.fulfilled, (state, action) => { //getAvailableLocations.fullfilled
                state.status = 'success'
                let stateList = action.payload.getStates
                let optionStateList = stateList.map((state) => ({
                    label: state.name,
                    value: state.id
                }))

                let cityList = action.payload.getCities
                let optionCitiesList = cityList.map((city) => ({
                    label: city.name,
                    value: city.id
                }))

                state.location.state_list = [...optionStateList]
                state.location.city_list = [...optionCitiesList]
            })
            .addCase(getAvailableLocations.pending, (state, action) => {
                state.status = 'loading'
            })            
            .addCase(getAvailableLocations.rejected, (state, action)=> {
                state.status = 'failed'
                state.error = action.error
            })
        },
    }
)


// Extract the action creators object and the reducer
const { actions: locationActions, reducer: locationReducer } = locationSlice

// Extract and export each action creator by name
export {locationActions}

// Export the reducer, either as a default or named export
export default locationReducer