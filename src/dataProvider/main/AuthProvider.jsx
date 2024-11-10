import { redirect } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"

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
                console.log({Login_Failed: response})
                // throw new HttpError('Api Login error', authenticateClient.status, response)  
                return Promise.reject() //response
            }

        console.log({headerLoginJWT:authenticateClient.headers.getSetCookie(), headers:authenticateClient.headers,response: response})
        const token = response.token
        const refreshToken = response.refreshToken
        const getTokenData = jwtDecode(token)
        console.log({crack_token: getTokenData})

        // AppDispatch(userLoggedIn({payload: getTokenData.username }))
        if(getLocalStorageItem('loggedIn') === false) setLocalStorageItem('loggedIn', true)
        inMemoryJwt.setToken(token)
        inMemoryJwt.setRefreshToken(refreshToken)
        setLocalStorageItem('email', getTokenData.username)        
        setLocalStorageItem('userId', getTokenData.id)        
                    
        // return Promise.resolve({redirectTo: '/dashboard',})
        return Promise.resolve(authenticateClient)            
    },
    logout: async () => {
        deleteLocalStorageItem('email')        
        
        
        if(!getLocalStorageItem('loggedIn')) return
        if(getLocalStorageItem('loggedIn') === false) return
        inMemoryJwt.ereaseToken()
        setLocalStorageItem('loggedOut', true)
        setLocalStorageItem('loggedIn', false)
        
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
        // if(!getLocalStorageItem('email')) redirect('/')
        const identifier = getLocalStorageItem('email')
        const token = inMemoryJwt.getToken()
        const prepareQueryObj = ApiFetchGetOptions(`/api/user_by_email/${identifier}/email`,{ 'X-Authorization': token})
        const authenticateClient = await ApiFetch(prepareQueryObj)
        const getResults = await authenticateClient.json()

        delete getResults['@context']
        delete getResults['@id']
        delete getResults['@type']
        
        console.log({GEtIdentity: getResults})
        // console.log({getSubscriptions: getResults.subscriptions.length !== 0 })
        const validSubscription = getResults?.subscriptions?.length !== 0
        inMemoryJwt.setValidSubscription(validSubscription)
        const username = getResults["firstName"] + ' ' + getResults["lastName"]

        return Promise.resolve({...getResults, fullName: username ?? '...' })
        // return Promise.resolve()
    },
    getPermissions: () => {
        // return inMemoryJwt.getToken() ?  Promise.resolve() : Promise.reject()
        return inMemoryJwt.waitForTokenRefresh().then(() => {
            return inMemoryJwt.getToken() ? Promise.resolve() : Promise.reject();
        })
    }
}    
