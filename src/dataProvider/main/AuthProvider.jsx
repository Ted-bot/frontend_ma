import { redirect } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"

import { ApiFetch, ApiFetchPostOptions } from '../../js/util/postUtil.js'
import { ApiFetchGetOptions, getLocalStorageItem, setLocalStorageItem, deleteLocalStorageItem } from '../../js/util/getUtil.js'
import { PostError } from '../../js/error/PostError.js'
import inMemoryJWT from '../../js/util/inMemoryJwt.js'
import { HttpError } from 'react-admin'
import inMemoryJwt from '../../js/util/inMemoryJwt.js'

export const authProvider = {
    login: async ({ email, password }) => {
        const apiOptions = {url: '/api/login_check', method: 'POST'} // , withCredentials: true
        const prepareQueryObj = ApiFetchPostOptions(apiOptions,{ username: email, password })
        const authenticateClient = await ApiFetch(prepareQueryObj)
        const response = await authenticateClient.json()
        
        if(!authenticateClient.ok)
            { 
                console.log({Login_Failed: response})
                // throw new HttpError('Api Login error', authenticateClient.status, response)  
                return Promise.reject(response)
            }
        console.log({headerLoginJWT:authenticateClient.headers.getSetCookie(), headers:authenticateClient.headers,response: response})
        const token = response.token
        const refreshToken = response.refreshToken
        const getTokenData = jwtDecode(token)
        console.log({crack_token: getTokenData})
        inMemoryJWT.setToken(token)
        inMemoryJWT.setRefreshToken(refreshToken)
        setLocalStorageItem('email', getTokenData.username)        
                    
        return Promise.resolve(authenticateClient)
            
    },
    logout: async () => {
        deleteLocalStorageItem('email')        
        const request = new Request('/api/logout', { // http://localhost:80
            method: 'GET',
            headers: new Headers({ 
                'Content-Type': 'application/json',
                'X-authorization' : inMemoryJWT.getToken() 
            }),
            // credentials: 'include',
        })

        inMemoryJWT.ereaseToken()

        return fetch(request).then(() => '/dashboard/login')
        // return Promise.resolve({ redirectTo: '/', logoutUser: true })
    },
    checkAuth: () => {
        // inMemoryJWT.getToken() !== null ? Promise.resolve() : Promise.reject({ redirectTo: '/login', logoutUser: true })
        return inMemoryJWT.waitForTokenRefresh().then(() => {
            return inMemoryJWT.getToken() ? Promise.resolve() : Promise.reject();
        })
    },
    checkError:  (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            inMemoryJWT.ereaseToken()
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve()
        // return Promise.resolve({redirectTo: '/dashboard', logoutUser: false })
    },
    getIdentity: async () => {
        const identifier = getLocalStorageItem('email')
        const token = inMemoryJWT.getToken()
        const prepareQueryObj = ApiFetchGetOptions(`/api/user_by_email/${identifier}/email`,{ 'X-Authorization': token})
        const authenticateClient = await ApiFetch(prepareQueryObj)
        const getResults = await authenticateClient.json()
        
        // console.log({GEtIdentity: getResults})
        // console.log({getSubscriptions: getResults.subscriptions.length !== 0 })
        const validSubscription = getResults.subscriptions.length !== 0
        inMemoryJwt.setValidSubscription(validSubscription)
        const username = getResults["firstName"] + ' ' + getResults["lastName"]
        return Promise.resolve({...getResults, fullName: username ?? '...' })
        // return Promise.resolve()
    },
    getPermissions: () => {
        // return inMemoryJWT.getToken() ?  Promise.resolve() : redirect('/login')
        return inMemoryJWT.waitForTokenRefresh().then(() => {
            return inMemoryJWT.getToken() ? Promise.resolve() : Promise.reject();
        })
    }
}    
