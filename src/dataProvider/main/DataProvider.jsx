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
    allBlackDragonEvents: async (resource, email) => {
        // const email = getLocalStorageItem('email')
        // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3Mjk4MDMyMDksImV4cCI6MTcyOTgzOTIwOSwicm9sZXMiOlsiUk9MRV9VU0VSX1NUVURFTlQiXSwidXNlcm5hbWUiOiJ0a2JvdGNoQGdtYWlsLmNvbSJ9.a2ycLWwQnjVBdDmmtUaLp5LRUjlCHuE7o5oEtlUs8Zho9EntKW02U3L_DB6z6anCTYnm0j5y4s0zr4k36xVH9MOU0xWl6zE5-NEkwCSH6ks-ienn0dFzeQK4UYBq_EUQtn17jUWHiJLipTHMe2CcD1W9IsnDOjETNrzWPh38Z7UT442CasV5KlEbIBu_QbjL6QBRgYpWv4Thz6j3jOcZEsoGRdqZgVa6a1F7nRY_yDIP3fpGldQUVDXpezwxZdTmrlszrXmq7DZ3k0mKLNl_0tX1qeyIDPGRfhQnV5qCKTBnE2uZokjHBocZpTm2qfv_4jkdY6aRuFJhoRHPsx6NZw'
        const token = inMemoryJwt.getToken()
        const ApiOptions = ApiFetchGetOptions(`/api/${resource}/${email}/events`,{'X-Authorization': token})
        const request = await ApiFetch(ApiOptions)
        const response = await request.json()   
        
        console.log({response: response})

        if(!request.ok){
            throw new HttpError('Shit, Black Dragon Events Not Found!', 404, response)              
        }   

        const events = response['hydra:member'].map((response) => ({
            id: response.id,
            title: response.title,
            start: new Date(response.startDate),
            end: new Date(response.endDate),
            resource: response.description,
        }))

        const checkIfUserHasSelectedEvent = response['hydra:member'].find((selectedEvent) => selectedEvent?.selectedEvent !== 0)

        if(!checkIfUserHasSelectedEvent){
            return {events: events, userSelectedEvents: null}
        }

        const filterSelectedEventByUser = response['hydra:member'].filter((response) => (
            response.selectedEvent !== 0
        ))

        const selectedEventByUser = filterSelectedEventByUser.map((fileredSelectedEvent) => (fileredSelectedEvent.id))

        // console.log({loadingUserSelectedEvents : selectedEventByUser})
        
        return {events: events, userSelectedEvents: selectedEventByUser}

    },
    userSelectedBlackDragonEvents: async (resource, params, payload) => {
        const token = inMemoryJwt.getToken()
        const postUserSelectedEvent = await fetch(`/api/${resource}/${params.email}/event/${params.id}`,{
            method:'POST',
            headers: {
                "Content-Type":"application/json",
                'X-Authorization': token
            },
            body: JSON.stringify({event_id: payload.event_id, select: payload.select})}
        )

        const response = await postUserSelectedEvent.json()

        console.log({responseuserSelectedBlackDragonEvents: response})

        if(!postUserSelectedEvent.ok) throw new HttpError(response.detail)

        return await response
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
