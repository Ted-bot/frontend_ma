import { redirect } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"
import { HttpError } from 'react-admin'

import { ApiFetch, ApiFetchPostOptions } from '../../js/util/postUtil.js'
import { ApiFetchGetOptions, getLocalStorageItem, setLocalStorageItem, deleteLocalStorageItem } from '../../js/util/getUtil.js'
import { PostError } from '../../js/error/PostError.js'
import inMemoryJwt from '../../js/util/inMemoryJwt.js'
import useStore from '../../hooks/store/useStore.jsx'

export const stateUser = async () => {
    const [loggedOutUser, setLoggedOutUser] = useStore("loggedOut")

    return {loggedOutUser, setLoggedOutUser}
}

export const authProvider = {
    login: async ({ email, password }) => {
        
        // const dispatch = useDispatch()
        const apiOptions = {url: '/api/login_check', method: 'POST'} // , withCredentials: true
        const prepareQueryObj = ApiFetchPostOptions(apiOptions,{ username: email, password })
        const authenticateClient = await ApiFetch(prepareQueryObj)
        const response = await authenticateClient.json()
        
        if(!authenticateClient.ok)
            { 
                console.log({Login_Failed: response.message})
                const {headers, status, body, message, detail} = response
                // throw new HttpError(response.message, authenticateClient.status, response)  
                return Promise.reject(new HttpError(message || detail, authenticateClient.status, response) ) 
            }

        // console.log({headerLoginJWT:authenticateClient.headers.getSetCookie(), headers:authenticateClient.headers,response: response})
        const token = response.token
        const refreshToken = response.refreshToken
        const getTokenData = jwtDecode(token)

        // console.log({tokenData: getTokenData})

        // AppDispatch(userLoggedIn({payload: getTokenData.username }))
        if(getLocalStorageItem('loggedIn') === false) setLocalStorageItem('loggedIn', true)
        inMemoryJwt.setToken(token)
        // inMemoryJwt.setRoles(getTokenData.roles)
        inMemoryJwt.setRefreshToken(refreshToken)

        setLocalStorageItem('exp', getTokenData.exp)
        setLocalStorageItem('email', getTokenData.username)        
        setLocalStorageItem('userId', getTokenData.id)        
        setLocalStorageItem('roles', JSON.stringify(getTokenData.roles))        
        // return Promise.resolve({redirectTo: '/dashboard',})
        return Promise.resolve(authenticateClient)            
    },
    logout: async () => {
        deleteLocalStorageItem('exp')        
        deleteLocalStorageItem('email')        
        deleteLocalStorageItem('user_address')        
        deleteLocalStorageItem('lines')        
        deleteLocalStorageItem('user_id')        
        // deleteLocalStorageItem('roles')        
        deleteLocalStorageItem('order_number')        
        deleteLocalStorageItem('amount')        
        deleteLocalStorageItem('selected_subscription_0')        
        deleteLocalStorageItem('error')        
        
        
        if(!getLocalStorageItem('loggedIn')) return
        if(getLocalStorageItem('loggedIn') === false) return
        inMemoryJwt.ereaseToken()
        // setLocalStorageItem('loggedOut', true)
        setLocalStorageItem('loggedIn', false)
        setLocalStorageItem('message', "successfully loged out!")
        setLocalStorageItem('success', true)
        
        return '/'
    },
    checkAuth: () => {
        // inMemoryJwt.getToken() !== null ? Promise.resolve() : Promise.reject({ redirectTo: '/login', logoutUser: true })
        return inMemoryJwt.waitForTokenRefresh().then(() => {
            return inMemoryJwt.getToken() ? Promise.resolve() : Promise.reject()
        })
    },
    checkError: async (error) => {
        console.log({'AuthProvider': error})
        const status = error?.status;
        if (status === 401 || status === 403) {
            inMemoryJwt.ereaseToken()
            return Promise.reject()
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve()
        // return Promise.resolve({redirectTo: '/dashboard', logoutUser: false })
    },
    getIdentity: async () => {
        const identifier = getLocalStorageItem('email')
        const token = inMemoryJwt.getToken()

        if(identifier && token){
            const prepareQueryObj = ApiFetchGetOptions(`/api/user_by_email/${identifier}/email`,{
                // 'Authorization': `Bearer ${token}`,
                'X-Authorization': `Bearer ${token}`,
            })
            const authenticateClient = await ApiFetch(prepareQueryObj)
            const getResults = await authenticateClient.json()

            console.log("see user info",getResults)

            delete getResults['@context']
            delete getResults['@id']
            delete getResults['@type']
            
            const validSubscription = getResults?.subscriptions?.length !== 0
            inMemoryJwt.setValidSubscription(validSubscription)

            const username = getResults["firstName"] + ' ' + getResults["lastName"]

            return Promise.resolve({...getResults, fullName: username ?? '...' })
        }

        return Promise.resolve()
    },
    getPermissions: () => {
        // return inMemoryJwt.getToken() ?  Promise.resolve() : Promise.reject()
        return inMemoryJwt.waitForTokenRefresh().then(() => {
            // console.log("permission time", inMemoryJwt.getRoles())
            return inMemoryJwt.getToken() ? inMemoryJwt.getRoles() : Promise.reject()
            // return inMemoryJwt.getToken() ? Promise.resolve() : Promise.reject();
        })
    },
    // canAccess: ({resource}) => {
    //     // return inMemoryJwt.getToken() ?  Promise.resolve() : Promise.reject()
    //     return inMemoryJwt.waitForTokenRefresh().then(() => {
    //         return resource
    //         // return inMemoryJwt.getRoles().find(role => role === resource) ?? false
    //     })
    // }
}    
