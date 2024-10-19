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
    initialState:{
        user: {...initialUserState}, 
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
        updateUser(state, action) {
            console.log({changed_update_user: action.payload})
            let email = action.payload.email
            let phone_number = action.payload.phone_number

            let original_number = state.user.phone_number
            let new_number = action.payload.phone_number
            let previousNumberOfString = original_number.substring(original_number.length - 8)
            let currentNumberOfString = new_number.substring(new_number.length - 8)

            if(email != state.user.email) state.user.email = email 
            if(previousNumberOfString != currentNumberOfString) state.user.phone_number = phone_number

            // console.log({updatedState: current(state)})
            // return current(state)
        },
        createUser(state, action){
            console.log({state, action})
            state.user.first_name = action.payload.first_name
            state.user.last_name = action.payload.last_name
            state.user.gender = action.payload.gender
            state.user.date_of_birth = action.payload.state_id
            state.user.email = action.payload.email
            state.user.state_id = action.payload.state_id
            state.user.location = action.payload.location
            state.user.city_id = action.payload.city_id
            state.user.phone_number = action.payload.phone_number
            state.user.location = action.payload.location
            state.user.conversion = action.payload.conversion
        },
        // updateProfile(state, action){
        //     console.log({state, action})
        // },
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

                state.user.state_list = [...optionStateList]
                state.user.city_list = [...optionCitiesList]
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

export const sendUpdatedUser = (payload) => {
    return async (dispatch) => {
        dispatch(userActions.showNotification({
            status: 'pending',
            title: 'Sending...',
            message: 'Sending Updated Data'
        }))
        const currentUserEmail = getLocalStorageItem('email') 
        
        const updateUser = Object.entries(payload).filter((field) => field[1] !== '')
        const map = new Map(updateUser)
        const createBodyRequest = Object.fromEntries(map)

        const data = changeObjKeysToCamelCaseFields(createBodyRequest)

        console.log({sendUpdateRequest: data})

        try {   
            const options = { url: `/api/user_by_email/${currentUserEmail}/email`, method: 'PATCH'}
            const updateUserData = ApiFetchPostOptions(options, data, {
                'X-Authorization': inMemoryJwt.getToken(),
                'Content-Type':'application/merge-patch+json'
            })            
            
            const response = await ApiFetch(updateUserData)
            const getResults = await response.json()
            
            if(!response?.ok)
            {   //if(response?.status >= 400 && response?.status <= 600)
                // const errorJson = await response?.json()
                throw {message: 'Api error send update user error!', errors: getResults}                
            }

            if(createBodyRequest?.email){
                alert(`please logout and login with if you changed email ${createBodyRequest.email}`)
            }
            console.log({succes_upload_updatedUser: getResults})
        } catch (error) {
                console.error({unhandledError_userSlice: error})
                dispatch(userActions.showNotification({
                    status: 'Error',
                    title: 'Error!',
                    message: 'Updating your data Failed'
                })) 
        }

        dispatch(userActions.updateUser(payload))
        dispatch(userActions.showNotification({
            status: 'success',
            title: 'Success!',
            message: 'Updated data successfully'
        })) 
    }
}

// Extract the action creators object and the reducer
const { actions: userActions, reducer } = userSlice

// Extract and export each action creator by name
export {userActions}

// Export the reducer, either as a default or named export
export default reducer