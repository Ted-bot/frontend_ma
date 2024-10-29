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
        const GetUrl = `/api/${resource}/${params}/dashboard/valid`
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
    getAllSubscriptions: async (resource, params) => {
        const GetUrl = `/api/${resource}/${params}/dashboard`
        const token = inMemoryJwt.getToken()
        // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3Mjk4MDMyMDksImV4cCI6MTcyOTgzOTIwOSwicm9sZXMiOlsiUk9MRV9VU0VSX1NUVURFTlQiXSwidXNlcm5hbWUiOiJ0a2JvdGNoQGdtYWlsLmNvbSJ9.a2ycLWwQnjVBdDmmtUaLp5LRUjlCHuE7o5oEtlUs8Zho9EntKW02U3L_DB6z6anCTYnm0j5y4s0zr4k36xVH9MOU0xWl6zE5-NEkwCSH6ks-ienn0dFzeQK4UYBq_EUQtn17jUWHiJLipTHMe2CcD1W9IsnDOjETNrzWPh38Z7UT442CasV5KlEbIBu_QbjL6QBRgYpWv4Thz6j3jOcZEsoGRdqZgVa6a1F7nRY_yDIP3fpGldQUVDXpezwxZdTmrlszrXmq7DZ3k0mKLNl_0tX1qeyIDPGRfhQnV5qCKTBnE2uZokjHBocZpTm2qfv_4jkdY6aRuFJhoRHPsx6NZw'
        const requestOptions = ApiFetchGetOptions(GetUrl, {'X-Authorization': token})        
        const request = await ApiFetch(requestOptions)
        const response = await request.json()      

        if(!request.ok) throw new HttpError('Failed to load subscriptions', 401, response)
            
        return response
          
    },
    cancelSubscription: async (resource, params, payload) => {
        const GetUrl = `/api/${resource}/${params}/id/${payload.name}`
        const token = inMemoryJwt.getToken()
        delete payload.name
        const requestOptions = ApiFetchPostOptions({url: GetUrl, method:'POST'}, payload,{
            'X-Authorization': token, 
            'Content-Type': 'application/json'
        })
        // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3Mjk4MDMyMDksImV4cCI6MTcyOTgzOTIwOSwicm9sZXMiOlsiUk9MRV9VU0VSX1NUVURFTlQiXSwidXNlcm5hbWUiOiJ0a2JvdGNoQGdtYWlsLmNvbSJ9.a2ycLWwQnjVBdDmmtUaLp5LRUjlCHuE7o5oEtlUs8Zho9EntKW02U3L_DB6z6anCTYnm0j5y4s0zr4k36xVH9MOU0xWl6zE5-NEkwCSH6ks-ienn0dFzeQK4UYBq_EUQtn17jUWHiJLipTHMe2CcD1W9IsnDOjETNrzWPh38Z7UT442CasV5KlEbIBu_QbjL6QBRgYpWv4Thz6j3jOcZEsoGRdqZgVa6a1F7nRY_yDIP3fpGldQUVDXpezwxZdTmrlszrXmq7DZ3k0mKLNl_0tX1qeyIDPGRfhQnV5qCKTBnE2uZokjHBocZpTm2qfv_4jkdY6aRuFJhoRHPsx6NZw'       
        const request = await ApiFetch(requestOptions)
        const response = await request.json()      

        if(!request.ok) throw new HttpError('Failed to load subscriptions', 401, response)
            
        return response
          
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
