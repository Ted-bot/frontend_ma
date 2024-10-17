import { createSlice } from "@reduxjs/toolkit"
// import { getAvailableLocations } from "../../middleware/locationThunk"
import { initialUserState } from "../../../js/util/auth"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { GetState, GetCity } from "react-country-state-city/dist/cjs"
import { countryid } from "../../../js/util/auth"
import { getLocalStorageItem } from "../../../js/util/getUtil"
import { ApiFetch } from "../../../js/util/postUtil"
import { ApiFetchGetOptions } from "../../../js/util/getUtil"
import inMemoryJwt from "../../../js/util/inMemoryJwt"

const USERS_URL = '/api/users'

export const getAvailableLocations = createAsyncThunk(
        '/api/getLocation', 
        async (id) => {
            try {
                let getCities = []
                const getStates = await GetState(countryid) // countryid
                if(id) getCities = await GetCity(countryid, id)
                    return { getStates, getCities}
            } catch (err) {
                console.log({'userSlice.js: - nr.19 - getLocation': err})
                return err.message
            }
        })

export const getUserProfile = createAsyncThunk(
    '/api/getUserProfile', 
    async () => {
        try {
            const identifier = getLocalStorageItem('email')
            const token = inMemoryJwt.getToken()
            const prepareQueryObj = ApiFetchGetOptions(`/api/user_by_email/${identifier}/email`,{ 'X-Authorization': token})
            const authenticateClient = await ApiFetch(prepareQueryObj)
            const getResults = await authenticateClient.json()
            return getResults
        } catch (err) {
            console.log({'userSlice.js: - nr.33 - getUserProfile': err})
            return err.message
        }
    })

const userSlice = createSlice({
    name: 'users',
    initialState:{user: {...initialUserState}, status: 'idle', error: null},
    reducers: {
        updateUser: {
            modify(state, action) {
                // state.user.users
                console.log({state, action})
            }
        },
        createUser: {createUser(state, action){
            console.log({state, action})
                state.user.users.push(action.payload)
            },
        },
        updateProfile(state, action){
            console.log({state, action})
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getAvailableLocations.fulfilled, (state, action) => { //getAvailableLocations.fullfilled
                state.status = 'success'

                const stateList = action.payload.getStates
                const optionStateList = stateList.map((state) => ({
                    label: state.name,
                    value: state.id
                }))

                const cityList = action.payload.getCities
                const optionCitiesList = cityList.map((city) => ({
                    label: city.name,
                    value: city.id
                }))

                state.user.state_list = [...optionStateList]
                state.user.city_list = [...optionCitiesList]
                console.log({updated_state: state.user.state_list})
            })
            .addCase(getAvailableLocations.pending, (state, action) => {
                state.status = 'loading'
            })            
            .addCase(getAvailableLocations.rejected, (state, action)=> {
                state.status = 'failed'
                state.error = action.error
            })
        builder
            .addCase(getUserProfile.fulfilled, (state, action) => { //getAvailableLocations.fullfilled
                state.status = 'success'
                state.user.first_name = action.payload.firstName
                state.user.last_name = action.payload.lastName
                state.user.gender = action.payload.gender
                state.user.email = action.payload.email
                state.user.state_id = action.payload.libReactState
                state.user.city_id = action.payload.libReactCity
                state.user.phone_number = action.payload.phoneNumber

                console.log({stateSlice: state.user, ReduxUserProfile: action.payload})
            })
            .addCase(getUserProfile.pending, (state, action) => {
                state.status = 'loading'
            })            
            .addCase(getUserProfile.rejected, (state, action)=> {
                state.status = 'failed'
                state.error = action.error
            })
    },
    selectors: {
        selectStateList: (state) => state.user.state_list
    }
    }
)

const{ selectStateList } = userSlice.selectors

// Extract the action creators object and the reducer
const { actions, reducer } = userSlice
// Extract and export each action creator by name
export {actions, selectStateList} // { createUser, updateUser, editLo }
// Export the reducer, either as a default or named export
export default reducer