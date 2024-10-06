import { redirect } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"

import { ApiFetch, ApiFetchPostOptions } from '../../js/util/postUtil.js'
import { getLocalStorageItem, ApiFetchGetOptions, setLocalStorageItem, deleteLocalStorageItem } from '../../js/util/getUtil.js'
import { getAuthToken, deleteAuthToken, setAuthToken } from '../../js/util/auth.js'
import { PostError } from '../../js/error/PostError.js'


export const authProvider = {
    login: async ({ email, password }) => {
        deleteAuthToken()
        deleteLocalStorageItem('email')
        
        const apiOptions = {url: '/api/login_check', method: 'POST'}
        const prepareQueryObj = ApiFetchPostOptions(apiOptions,{ username: email, password })
        const authenticateClient = await ApiFetch(prepareQueryObj)
        const response = await authenticateClient.json()

        const token = response.token
        const getTokenData = jwtDecode(token)

        setAuthToken(token)
        setLocalStorageItem('email', getTokenData.username)
        
        if(!authenticateClient.ok)
        {
            console.log({redirect: 'failed!'})
            throw new PostError('Api Login error', response)  
        }
        
        return Promise.resolve(authenticateClient)
    },
    logout: () => {
        deleteAuthToken()
        deleteLocalStorageItem('email')
        redirect('/')
        return Promise.resolve()
    },
    checkAuth: () =>
            getAuthToken() != null ? Promise.resolve() : Promise.reject(),
    checkError:  (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            deleteAuthToken()
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    getIdentity: async () => {
        const identifier = getLocalStorageItem('email')
        const token = getAuthToken()
        const prepareQueryObj = ApiFetchGetOptions(`/api/user_by_email/${identifier}/email`,{ 'X-Authorization': token})
        const authenticateClient = await ApiFetch(prepareQueryObj)
        const getResults = await authenticateClient.json()
        const username = getResults["firstName"] + ' ' + getResults["lastName"]
        return Promise.resolve({...getResults, fullName: username ?? '...' })
    },
    getPermissions: () => Promise.resolve(),
}    
