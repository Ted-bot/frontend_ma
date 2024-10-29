import { 
    fetchHydra,
    hydraDataProvider,
} from '@api-platform/admin'
import { fetchUtils } from 'react-admin'
import { ApiFetch, ApiFetchPostOptions } from '../../js/util/postUtil'
import { ApiFetchGetOptions} from '../../js/util/getUtil'
import { parseHydraDocumentation } from "@api-platform/api-doc-parser"
import inMemoryJwt from '../../js/util/inMemoryJwt.js'
import { HttpError } from 'react-admin'

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
    getUserRegisteredEvents: async (resource, params) => {
        const token = inMemoryJwt.getToken()
        const options = {headers: null}
        options.headers = new Headers({'X-Authorization': token})
        const response = await fetchUtils.fetchJson(`/api/user/${params}/${resource}/`,options )
        return response.json
    },
    getOneSubscription: async (resource, params) => {
        const GetUrl = `/api/${resource}/${params}/dashboard/valid`
        const token = inMemoryJwt.getToken()
        const requestOptions = ApiFetchGetOptions(GetUrl, {'X-Authorization': token})

        const request = await ApiFetch(requestOptions)
        const response = await request.json()      
        if(!request.ok) throw new HttpError()

        return response
    },
    getAllSubscriptions: async (resource, params) => {
        const GetUrl = `/api/${resource}/${params}/dashboard`
        const token = inMemoryJwt.getToken()
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
        
        const request = await ApiFetch(requestOptions)
        const response = await request.json()               
        
        if(!request.ok){
            throw new HttpError('messageError')
        }
        return response

    },
    updateUserAddress: async (resource, params, payload) => {
        const GetUrl = `/api/${resource}/${params.email}/id/${params.id}`
        const token = inMemoryJwt.getToken()
        const requestOptions = ApiFetchPostOptions({url: GetUrl, method:'POST'}, payload,{
            'X-Authorization': token, 
            'Content-Type': 'application/json'
        })

        const request = await ApiFetch(requestOptions)
        const response = await request.json()               
        
        if(!request.ok) throw response 

        return response  
    },
})
