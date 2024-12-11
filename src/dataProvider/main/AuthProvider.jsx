import { redirect } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"
import { HttpError, addRefreshAuthToAuthProvider } from 'react-admin'

import { ApiFetch, ApiFetchPostOptions } from '../../js/util/postUtil.js'
import { ApiFetchGetOptions, getLocalStorageItem, setLocalStorageItem, deleteLocalStorageItem } from '../../js/util/getUtil.js'
import { PostError } from '../../js/error/PostError.js'
import inMemoryJwt from '../../js/util/inMemoryJwt.js'
import useStore from '../../hooks/store/useStore.jsx'
import { Mutex } from "async-mutex"


export const refreshAuth = () => {
    const refreshMutex = new Mutex()
    return refreshMutex.runExclusive(async () => {
        const accessToken = getLocalStorageItem('exp')
        console.log({ CheckRefreshNeeded :accessToken < new Date(Date.now()).getTime() / 1000, accessToken : accessToken , currentTime : new Date(Date.now()).getTime() / 1000 })
        if(accessToken){

        } else if (accessToken < new Date(Date.now()).getTime() / 1000) {        // This function will fetch the new tokens from the authentication service and update them in localStorage
            console.log({ refreshIsNeeded :accessToken < new Date(Date.now()).getTime() / 1000, accessToken : accessToken , currentTime : new Date(Date.now()).getTime() / 1000 })
            
            if(inMemoryJwt.checkAvailableRefreshToken())
            {
                return inMemoryJwt.getRefreshedToken()
            }
        }
        return Promise.resolve()    
    }
)}

export const myAuthProvider = {
    login: async ({ email, password }) => {
        // try {
            if(!email || !password ){
                console.log({missingCredentials: password, missingUsername: email})
                throw new HttpError("missing credentials", 403)
                // return
            }
            const apiOptions = {url: '/api/login_check', method: 'POST'} // , withCredentials: true
            const prepareQueryObj = ApiFetchPostOptions(apiOptions,{ username: email, password })
            const authenticateClient = await ApiFetch(prepareQueryObj)
            const response = await authenticateClient.json()
            
            if(!authenticateClient.ok)
                { 
                    console.log({Login_Failed: response.message})
                    const {headers, status, body, message, detail} = response
                    // throw new HttpError(response.message, authenticateClient.status, response)  
                    throw new HttpError(message || detail, authenticateClient.status, response) 
                }

            // console.log({headerLoginJWT:authenticateClient.headers.getSetCookie(), headers:authenticateClient.headers,response: response})
            const {token, refreshToken, refresh_token_expiration} = response
            const getTokenData = jwtDecode(token)

            console.log({tokenData: getTokenData})

            // AppDispatch(userLoggedIn({payload: getTokenData.username }))
            if(getLocalStorageItem('loggedIn') === false) setLocalStorageItem('loggedIn', true)
            inMemoryJwt.setToken(token)
            inMemoryJwt.setRoles(getTokenData.roles)
            inMemoryJwt.setRefreshToken(refreshToken)

            console.log({ getTokenExp: getTokenData.exp, deconstructedToken: refresh_token_expiration , authenticateClient})

            setLocalStorageItem('exp', refresh_token_expiration)
            setLocalStorageItem('email', getTokenData.username)        
            setLocalStorageItem('userId', getTokenData.id)        
            setLocalStorageItem('roles', JSON.stringify(getTokenData.roles))        
            console.log({loginResponse: response})
            return Promise.resolve()  
        // } catch (error) {
        //     Promise.reject(error)
        // }
    },
    logout: () => {
        console.log("loggin out")
        deleteLocalStorageItem('users')        
        deleteLocalStorageItem('profiles')     

        deleteLocalStorageItem('exp')        
        deleteLocalStorageItem('email')        
        deleteLocalStorageItem('user_address')        
        deleteLocalStorageItem('lines')        
        deleteLocalStorageItem('user_id')        
        deleteLocalStorageItem('roles')        
        deleteLocalStorageItem('order_number')        
        deleteLocalStorageItem('amount')        
        deleteLocalStorageItem('selected_subscription_0')        
        deleteLocalStorageItem('error')                
        
        if(!getLocalStorageItem('loggedIn')) return
        // if(getLocalStorageItem('loggedIn') === false) return
        inMemoryJwt.ereaseToken()
        // setLocalStorageItem('loggedOut', true)
        setLocalStorageItem('loggedIn', false)
        setLocalStorageItem('message', "successfully logged out!")
        setLocalStorageItem('success', true)
        
        return Promise.resolve('/')
        // return '/'
    },
    checkAuth: params => {
        // try {
            if(!inMemoryJwt.getToken()){
                console.log({auth_check: inMemoryJwt.getToken()})
                // throw new Error("No Authorization givin")
                const error = new Error("No Authorization givin", 403)
                error.redirectTo = "/contact"
                error.status = 401
                // error.logoutUser = false
                throw error
                // console.error(error)
                return Promise.reject()            
            }

            return Promise.resolve()

        // } catch (error) {
        //     return Promise.reject(error.message)            
        // }
    },
    checkError: async (error) => {
        // console.log({authProvider_error_check: error})
        const status = error?.status;
        if (status === 401 || status === 403) {
            // inMemoryJwt.ereaseToken()
            const error = new Error()
            error.redirectTo = "/dashboard/login"
            error.logoutUser = false
            throw error
        }
        return Promise.resolve()
    },
    getIdentity: async () => {

        try {
            const identifier = getLocalStorageItem('email')
            const token = inMemoryJwt.getToken()
            console.log({token: token, email: identifier})
            
            if(!identifier || !token) throw new HttpError("No Authentication found",401)
                
            const prepareQueryObj = ApiFetchGetOptions(`/api/user_by_email/${identifier}/email`,{
                // 'Authorization': `Bearer ${token}`,
                'X-Authorization': `Bearer ${token}`,
            })
            const authenticateClient = await ApiFetch(prepareQueryObj)
            const getResults = await authenticateClient.json()

            if(!authenticateClient.ok)
            { 
                console.log({Login_Failed: response.message})
                const {headers, status, body, message, detail} = response
                // throw new HttpError(response.message, authenticateClient.status, response)  
                throw new HttpError(message || detail, authenticateClient.status, response) 
            }

            console.log("see user info",getResults)

            delete getResults['@context']
            delete getResults['@id']
            delete getResults['@type']
            
            const validSubscription = getResults?.subscriptions?.length !== 0
            inMemoryJwt.setValidSubscription(validSubscription)

            const username = getResults["firstName"] + ' ' + getResults["lastName"]

            return Promise.resolve({...getResults, fullName: username ?? '...' })
        } catch (error) {
            console.error(error)
        }
    },
    getPermissions: () => {
        console.log({permissions_check: inMemoryJwt.getToken()})
        if(inMemoryJwt.getToken()) return Promise.resolve(inMemoryJwt.getRoles())
        else throw new HttpError('Permissions not found', 403)
    }
}    

export const authProvider = addRefreshAuthToAuthProvider(myAuthProvider, refreshAuth)
// export const authProvider = myAuthProvider