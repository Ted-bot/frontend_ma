import { 
    fetchHydra,
    hydraDataProvider,
} from '@api-platform/admin'
import { fetchUtils } from 'react-admin'
import { ApiFetch, ApiFetchPostOptions } from '../../js/util/postUtil'
import { ApiFetchGetOptions} from '../../js/util/getUtil'
import { parseHydraDocumentation } from "@api-platform/api-doc-parser"
import inMemoryJwt from '../../js/util/inMemoryJwt.js'
import { HttpError } from 'react-admin';
import { GetState, GetCity } from "react-country-state-city/dist/cjs"
import { countryid } from '../../js/util/auth.js'

const getAuthHeaders = () => {
    const token = inMemoryJwt.getToken()
    const headers = new Headers()
    if(token){ 
        headers.set("X-Authorization", token)
    } else {
        inMemoryJwt.getRefreshedToken()
        if(inMemoryJwt.getToken()) headers.set('X-Authorization', `${inMemoryJwt.getToken()}`)
    }    
    return headers;
};

const getHydraWithHeaders = (url, options = {}) =>
    {
        console.log({urlSet: url})
        return fetchHydra(url, {
            ...options,
            headers: inMemoryJwt.getToken() ? getAuthHeaders() : options.headers,
        })
    }
    

const apiDocumentationParser = async () => {
    try {
        // setRedirectToLogin(false)    
        return await parseHydraDocumentation("/api", {
            headers: getAuthHeaders(),
        })
    } catch (result) {
        const { api, request, status } = result;
        if (status !== 401 || !request) {
        throw result;
        }
    
        inMemoryJwt.ereaseToken()
    
        return {
            api,
            request,
            status,
        }
    }
}

export const dataProvider = ({
    ...hydraDataProvider({
        entrypoint: '/api',
        httpClient: getHydraWithHeaders,
        useEmbedded: true,
        apiDocumentationParser: apiDocumentationParser
    }),
    getOneSubscription: async (resource, params) => {
        const GetUrl = `/api/${resource}/${params}/dashboard`
        const token = inMemoryJwt.getToken()
        const requestOptions = ApiFetchGetOptions(GetUrl, {'X-Authorization': token})
        
        try {      
            const request = await ApiFetch(requestOptions)
            const response = await request.json()      
            if(!request.ok) throw new HttpError()
            //   throw new HttpError(response.message, response.status)      
            return response
          
          } catch (error) {
            // console.log({ no_valid_auth_or_subscription: error })
        }  
    },
    updateUserIdentity: async (resource, params, payload) => {
        const GetUrl = `/api/${resource}/${params}/email`
        const token = inMemoryJwt.getToken()
        const requestOptions = ApiFetchPostOptions({url: GetUrl, method:'PATCH'}, payload,{
            'X-Authorization': token, 
            'Content-Type': 'application/merge-patch+json'
        })

        
        // try {      
            const request = await ApiFetch(requestOptions)
            const response = await request.json()               
            
            if(!request.ok){
                throw new HttpError('messageError')
            }
            //   throw new HttpError(response.message, response.status)      
            return response
          
        //   } catch (error) {
            // console.log({ no_valid_auth_or_subscription: error })
        // }  
    },
    updateUserAddress: async (resource, params, payload) => {
        const GetUrl = `/api/${resource}/${params.email}/id/${params.id}`
        const token = inMemoryJwt.getToken()
        const requestOptions = ApiFetchPostOptions({url: GetUrl, method:'POST'}, payload,{
            'X-Authorization': token, 
            'Content-Type': 'application/json'
        })

        
        // try {      
            const request = await ApiFetch(requestOptions)
            const response = await request.json()               
            
            if(!request.ok){
                throw response
            }
            //   throw new HttpError(response.message, response.status)      
            return response
          
        //   } catch (error) {
            // console.log({ no_valid_auth_or_subscription: error })
        // }  
    },
})
