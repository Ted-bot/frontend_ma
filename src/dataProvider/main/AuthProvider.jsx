import { AdminGuesser,
    hydraDataProvider,
    hydraSchemaAnalyzer,
    ResourceGuesser,
} from '@api-platform/admin'
import { Layout, CustomRoutes} from 'react-admin'
import { Route } from 'react-router-dom'

import { ApiFetch, ApiFetchPostOptions } from '../../js/util/postUtil.js'
import { getLocalStorageItem, ApiFetchGetOptions } from '../../js/util/getUtil.js'
import { getAuthToken, deleteAuthToken } from '../../js/util/auth.js'
import { PostError } from '../../js/error/PostError.js'

import { dataProvider } from './DataProvider.jsx'

export const authProvider = {
    login: async ({ email, password }) => {
        
        const apiOptions = {url: '/api/login_check', method: 'POST'}
        const prepareQueryObj = ApiFetchPostOptions(apiOptions,{ username: email, password })
        const authenticateClient = await ApiFetch(prepareQueryObj)
        
        if(!authenticateClient.ok)
        {
            console.log({redirect: 'failed!'})
            const response = await authenticateClient.json()
            throw new PostError('Api Login error', response)  
        }

        console.log({loggedIn: authenticateClient})
        
        return Promise.resolve(authenticateClient)           

    },
    logout: () => {
        deleteAuthToken()
        // localStorage.removeItem('email');
        return Promise.resolve()
    },
    checkAuth: () =>
            getAuthToken() != null ? Promise.resolve() : Promise.reject(),
        // localStorage.getItem('email') ? Promise.resolve() : Promise.reject(),
    checkError:  (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            deleteAuthToken()
            // localStorage.removeItem('email');
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
