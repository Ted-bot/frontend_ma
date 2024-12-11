import { 
    fetchHydra,
    hydraDataProvider,
} from '@api-platform/admin'
import { fetchUtils, addRefreshAuthToDataProvider } from 'react-admin'
import { ApiFetch, ApiFetchPostOptions } from '../../js/util/postUtil'
import { ApiFetchGetOptions, deleteLocalStorageItem, getLocalStorageItem, setLocalStorageItem} from '../../js/util/getUtil'
import { parseHydraDocumentation } from "@api-platform/api-doc-parser"
import inMemoryJwt from '../../js/util/inMemoryJwt.js'
import { HttpError } from 'react-admin'
import moment from 'moment-timezone'
import { reformatSingleDateItem } from '../../js/util/dateUtil.js'

const getAuthHeaders = () => {
    const token = inMemoryJwt.getToken()
    const headers = new Headers({"Content-Type": "application/json"})
    headers.set("X-Authorization", `Bearer ${token}`)
    
    // if(token){ 
    //     // headers.set("Authorization", `Bearer ${token}`)
    //     headers.set("X-Authorization", `Bearer ${token}`)
    // } else {
    //     if(inMemoryJwt.checkAvailableRefreshToken()){
    //         inMemoryJwt.getRefreshedToken()
    //         inMemoryJwt.waitForTokenRefresh().then(() => {
    //             // headers.set("Content-Type", "application/json")
    //             // headers.set('X-Authorization', `Bearer ${inMemoryJwt.getToken()}`)
    //             headers.set('X-Authorization', `Bearer ${inMemoryJwt.getToken()}`)
    //         })
    //     }
    // }    
    return headers
};

const getHydraWithHeaders = (url, options = {}) =>
    {
        console.log({urlSet: url})
        return fetchHydra(url, {
            ...options,
            // mode: "no-cors",
            // method: 'GET',
            // crossDomain: true,
            withCredentials: true, // https://stackoverflow.com/questions/60339505/react-request-is-being-sent-without-an-authorization-header
            // credentials: 'include', //
            headers: getAuthHeaders(),
        })
    }

const refreshAuth = () => {
    // const { accessToken, refreshToken } = getAuthTokensFromLocalStorage();
    const accessToken = getLocalStorageItem('exp')
    if (accessToken < new Date(Date.now()).getTime() / 1000) {
        // This function will fetch the new tokens from the authentication service and update them in localStorage
        // return refreshAuthTokens(refreshToken);
        if(inMemoryJwt.checkAvailableRefreshToken()){
            inMemoryJwt.getRefreshedToken()
            return inMemoryJwt.waitForTokenRefresh()
        }
    }
    return Promise.resolve();
}

const apiDocumentationParser = async () => {
    try {
        // setRedirectToLogin(false)    
        return await parseHydraDocumentation("/api", {
            method: 'GET',
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

export const baseDataProvider = ({
    ...hydraDataProvider({
        entrypoint: '/api',
        httpClient: getHydraWithHeaders,
        useEmbedded: true,
        apiDocumentationParser: apiDocumentationParser
    }),
    getList: async (resource,params) => {
        let query = undefined
        let setupQuery = undefined 
        let changePagination = undefined 
        let setQuery = ""
        let storeUsersData = undefined
        const token = inMemoryJwt.getToken()
        const options = {headers: null}
        options.headers = new Headers({'X-Authorization': `bearer ${token}`})

        // console.log({GetListResourse: resource,params})

        if(params?.pagination?.page || params?.filter){
            const filter = params?.filter
            const operators = { '_gte': 'after', '_lte': 'before', '_neq': '!=' }
            // const operators = { '_gte': '>=', '_lte': '<=', '_neq': '!=' }
            const setItemsPerPage = params?.pagination?.perPage
            const filters = Object.keys(filter).map(key => {
                const operator = operators[key.slice(-4)]
                console.log({ListOperator: operator,key: key, sliceKey: key.slice(-4), filter: filter})
                return operator
                    ? { field: key.slice(0, -4), operator, value: filter[key] }
                    : { field: key, operator: '=', value: filter[key] }
            })

            changePagination = params?.pagination?.page
            
            // console.log({filterList: filters})
    
            setQuery = !!changePagination && setItemsPerPage ? `pagination=true&page=${changePagination}&itemsPerPage=${setItemsPerPage}` : ""

            for (const item of filters){
                if(!item.field && !item.value) continue
                setQuery += `${!!setQuery ? '&' : ''}${item.field}${item.operator != '=' ? `[${item.operator}]` : ''}=${item.value}` //item.operator
            }

            query = filters.length !== 0 || !!setQuery ? setQuery : undefined
        }           

        const addParams = typeof query == "string" ? query : ""        
        const response = await fetchUtils.fetchJson(`/api/${resource}${!!addParams ? '?' : ''}${addParams}`,options )
        
        const configurePagination = (response) => {
            const currentPage = response.view["@id"]
            const firstPage = response.view.first
            const lastPage = response.view.last
            let nextPage = undefined

            for(const [key, value] of Object.entries(response.view)){
                if(key === "next"){
                    nextPage = response.view.next
                }
            }            

            const currentPageNr = currentPage.charAt(currentPage.length - 1)
            const firstPageNr = firstPage.charAt(firstPage.length - 1)
            const lastPageNr = lastPage.charAt(lastPage.length - 1)
            const nextPageNr = !!nextPage && nextPage.charAt(nextPage.length - 1)
            const nextPageAvailable = Number(currentPageNr) < Number(lastPageNr)
            const previousPageAvailable = Number(currentPageNr) > Number(firstPageNr)

            return {hasPreviousPage: previousPageAvailable, hasNextPage:nextPageAvailable}
        }
        const data = response.json.member
        
        let pagination = false
        
        if(!!response.json?.view){
            pagination = Object.keys(response.json.view).find(key => key === 'first') && configurePagination(response.json)
        }

        if(resource === "users") storeUsersData = data.map(user => ({id: user.id, email: user.email}))        
        
        if(resource === "profiles")  storeUsersData = data.map(profile => ({id: profile.id, username: profile.username, userId: profile.userUniq?.id}))

        setLocalStorageItem(resource, storeUsersData)

        return {
            data: data, 
            total: response.json.totalItems, 
            pageInfo:{
                hasPreviousPage: !!pagination && pagination.hasPreviousPage,
                hasNextPage: !!pagination && pagination.hasNextPage
            }
        }
    },
    create: async (resource, params) => {
        const token = inMemoryJwt.getToken()
        console.log({createNewUser: resource, params})

        const postUserSelectedEvent = await fetch(`/api/${resource}`,{
            method:'POST',
            headers: {
                "Content-Type":"application/json",
                'X-Authorization': `bearer ${token}`
            },
            body: JSON.stringify(params.data)}
        )

        if(!postUserSelectedEvent.ok) return Promise.reject()  // show error with notify

        const response = await postUserSelectedEvent.json()

        return Promise.resolve({data: response})
    },
    update: async (resource, params) => {
        const token = inMemoryJwt.getToken()
        console.log({getUser: resource, params: params})
        let query = resource
        let updateData = params.data
        let addParam = undefined        
        let identifier = undefined
        let getUser = undefined

        if(!params.data?.password) {
            delete params.data?.password
        }
        
        if(resource === 'users') {
            addParam = 'email'
            getUser = getLocalStorageItem("users")?.find(user => user?.id === Number(params?.id))
            identifier = getUser?.email
            query = `${'user_by_email'}/${identifier}/email`
        } else if (resource === 'trainingsessions') {
            // set only IRI as related user data 
            updateData = {...updateData, 'relatedUser': `/api/profiles/${updateData.relatedUser['id']}`}
            
            // set array with only IRI as subscribed profile data 
            let subscribedTo = []
            for (const [key, value] of Object.entries(updateData.subscribedTo)){
                subscribedTo[key] = '/api/profiles/' + value.id
            }

            console.log({got_Subscribe_training: subscribedTo, original: updateData.subscribedTo})

            updateData = {...updateData, 'subscribedTo': subscribedTo}
            query = `${resource}/${params.id}`
        } else{
            query = `${resource}/${params.id}`
        }
// return
        const options = {
            body: JSON.stringify(updateData),
            method: 'PATCH',
            headers: null
        }
        options.headers = new Headers({
            'X-Authorization': `bearer ${token}`,
            'Content-Type': 'application/merge-patch+json'
        })


        const response = await fetchUtils.fetchJson(`/api/${query}`,options )
        const {headers, status, body, detail} = response
        const responeData = response.json.member
        console.log({message: response})

       

        if( 200 < response.status || response.status > 300) {
            throw Promise.reject(new HttpError(response?.json || detail, status, response.json))
        }

        return Promise.resolve({data: response.json})
    },
    delete: async (resource, params) => {
        const token = inMemoryJwt.getToken()
        console.log({getUser: resource, params: params})
        let query = resource
        let addParam = undefined
        let identifier = undefined
        let getUser = undefined
        const options = {
            // body: JSON.stringify(params.data),
            method: 'DELETE',
            headers: null
        }
        options.headers = new Headers({
            'X-Authorization': `bearer ${token}`,
            'Content-Type': 'application/ld+json'
        })

        if(resource === 'users') {
            addParam = 'email'
            getUser = getLocalStorageItem("users")?.find(user => user?.id === Number(params?.id))
            identifier = getUser?.email
            query = `${'user_by_email'}/${identifier}/email`
        }

        const response = await fetchUtils.fetchJson(`/api/${query}`,options )
        const {headers, status, body, statusText} = response

        console.log({message: response})

        if( 200 < response.status || response.status > 300) {
            throw Promise.reject(new HttpError(response?.json || statusText, status, response.json))
        }

        return Promise.resolve({data: response.json})
    },
    getOne: async (resource, params) => {
        const token = inMemoryJwt.getToken()
        console.log({getUser: resource, params: params?.id})
        let query = `${resource}/${params?.id}`
        let addParam = undefined
        let identifier = undefined
        let getUser = undefined
        const options = {headers: null}
        options.headers = new Headers({'X-Authorization': `bearer ${token}`})

        if(resource === 'users') {
            addParam = 'email'
            getUser = getLocalStorageItem("users")?.find(user => user?.id === Number(params?.id))
            identifier = getUser?.email
            query = `${'user_by_email'}/${identifier}/email`
        }

        const response = await fetchUtils.fetchJson(`/api/${query}`,options )

        if(response.status > 399) return Promise.reject()

            console.log({allDataGetOne: response.json})

        return Promise.resolve({data: {...response.json, id:response.json.id}})
    },
    getManyReference: async (resource, params) => {
        let query = ""
        let setupQuery = "" 
        let changePagination = "" 
        let setQuery = ""
        const token = inMemoryJwt.getToken()
        const options = {headers: null}
        options.headers = new Headers({'X-Authorization': `bearer ${token}`})
        const filter = params?.filter
        const operators = { '_gte': '>=', '_lte': '<=', '_neq': '!=' }

        const filters = Object.keys(filter).map(key => {
            const operator = operators[key.slice(-4)]
            return operator
                ? { field: key.slice(0, -4), operator, value: filter[key] }
                : { field: key, operator: '=', value: filter[key] }
        })

        if(params){
            const target = params?.target

            changePagination = params?.pagination?.page
    
            setQuery = !!changePagination ? `page=${changePagination}` : ""

            for (const item of filters){
                if(!item.field && !item.value) continue
                setQuery += `${!!setQuery ? '&' : ''}${item.field}=${item.value}`
            }
            query = target ? setQuery : ""
        }           
        console.log({getManyReference:query,resource,params})

        const addParams = typeof query == "string" ? query : ""        
        const response = await fetchUtils.fetchJson(`/api/${resource}${!!addParams ? '?' : ''}${addParams}`,options )
        
        console.log({getManyReferenceResponse:response.json})

        const configurePagination = (response) => {
            const currentPage = response["view"]["@id"]
            const firstPage = response["view"]["first"]
            const lastPage = response["view"]["last"]
            let nextPage = undefined

            for(const [key, value] of Object.entries(response.view)){
                if(key === "next"){
                    nextPage = response.view.next
                }
            }            

            const currentPageNr = currentPage.charAt(currentPage.length - 1)
            const firstPageNr = firstPage.charAt(firstPage.length - 1)
            const lastPageNr = lastPage.charAt(lastPage.length - 1)
            const nextPageNr = !!nextPage && nextPage.charAt(nextPage.length - 1)
            const nextPageAvailable = Number(currentPageNr) < Number(lastPageNr)
            const previousPageAvailable = Number(currentPageNr) > Number(firstPageNr)

            return {hasPreviousPage: previousPageAvailable, hasNextPage:nextPageAvailable}
        }
        const data = response.json.member
        const pagination = Object.keys(response.json.view).find(key => key === 'first') && configurePagination(response.json)
        
        const storeUsersData = data.map(user => ({id: user.id, email: user.email}))
        setLocalStorageItem(resource, storeUsersData)

        return {
            data: data, 
            total: response.json.totalItems, 
            pageInfo:{
                hasPreviousPage: !!pagination && pagination.hasPreviousPage,
                hasNextPage: !!pagination && pagination.hasNextPage
            }
        }
    },
    getUserRegisteredEvents: async (resource, params) => {
        const token = inMemoryJwt.getToken()
        const options = {headers: null}
        options.headers = new Headers({
            'X-Authorization': `bearer ${token}`,
            "Content-Type":"application/jsonld",
        })
        const response = await fetchUtils.fetchJson(`/api/user/${params}/${resource}/`,options )
        return response.json
    },
    getOneSubscription: async (resource, params) => {
        const GetUrl = `/api/${resource}/${params}/dashboard/valid`
        const token = inMemoryJwt.getToken()
        const requestOptions = ApiFetchGetOptions(GetUrl, {'X-Authorization': `bearer ${token}`})

        const request = await ApiFetch(requestOptions)
        const response = await request.json()      
        if(!request.ok) throw new HttpError()

        return response
    },
    getAllSubscriptions: async (resource, params) => {
        const GetUrl = `/api/${resource}/${params}/dashboard`
        const token = inMemoryJwt.getToken()
        const requestOptions = ApiFetchGetOptions(GetUrl, {'X-Authorization': `bearer ${token}`})        
        const request = await ApiFetch(requestOptions)
        const response = await request.json()      

        if(!request.ok) throw new HttpError('Failed to load subscriptions', 401, response)
            
        return response
          
    },
    allBlackDragonEvents: async (resource, email) => {
        // const email = getLocalStorageItem('email')
        const token = inMemoryJwt.getToken()
        const ApiOptions = ApiFetchGetOptions(`/api/${resource}/${email}/events`,{
            'X-Authorization': `bearer ${token}`,
            "Content-Type": "application/json"
        })
        const request = await ApiFetch(ApiOptions)
        const response = await request.json()   
        
        console.log({response: response})

        if(!request.ok){
            throw new HttpError('Shit, Black Dragon Events Not Found!', 404, response)              
        }   

        const events = response['member'].map((response) => {
            const utcDate = reformatSingleDateItem({start: response.startDate, end: response.endDate})
            console.log({start: utcDate.start, endDate:utcDate.end})
            return {
                id: response.id,
                title: response.title,
                start: utcDate.start,
                end: utcDate.end,
                resource: response.description
            }
        })

        const checkIfUserHasSelectedEvent = response['member'].find((selectedEvent) => selectedEvent?.selectedEvent !== 0)

        if(!checkIfUserHasSelectedEvent){
            return {events: events, userSelectedEvents: null}
        }

        const filterSelectedEventByUser = response['member'].filter((response) => (
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
                'X-Authorization': `bearer ${token}`
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
            'X-Authorization': `bearer ${token}`, 
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
            'X-Authorization': `bearer ${token}`, 
            'Content-Type': 'application/merge-patch+json'
        })
        
        const request = await ApiFetch(requestOptions)
        const response = await request.json()               
        
        if(!request.ok){
            throw new HttpError(response.message)
            // throw new HttpError('messageError')
        }
        return response

    },
    updateUserAddress: async (resource, params, payload) => {
        const GetUrl = `/api/${resource}/${params.email}/id/${params.id}`
        const token = inMemoryJwt.getToken()
        const requestOptions = ApiFetchPostOptions({url: GetUrl, method:'POST'}, payload,{
            'X-Authorization': `bearer ${token}`, 
            'Content-Type': 'application/json'
        })

        const request = await ApiFetch(requestOptions)
        const response = await request.json()               
        
        if(!request.ok) throw response 

        return response  
    },
    getUserDataForPayment: async (resource, params) => {
        const deleteStorageValeus = ['amount', 'locale', 'description', 'order_number', 'EUR', 'lines', 'user_address']

        deleteStorageValeus.forEach(key => {
            deleteLocalStorageItem(key)
            // console.log({deleteSuccessExample_Lines: localStorage.getItem(`${key}`), key})
        })

        const token = inMemoryJwt.getToken()
        // const ApiOptions = ApiFetchGetOptions('/api/v1/order/payment',{'X-Authorization': `bearer ${token}`})
        const ApiOptions = ApiFetchGetOptions(resource,{
            'X-Authorization': `bearer ${token}`,
            "Content-Type": "application/json"
        })
        const response = await ApiFetch(ApiOptions)
        const getResults = await response.json()       

        if(!response.ok){
            console.log("got payment:error", response)
            console.log("got payment:error json", getResults)
            if(response.code === 401 && response.message === 'Invalid JWT Token'){
                // setLocalStorageItem('message',"We couldn't verify you if you still here, please try loggin again")
                // setLocalStorageItem('error',true)
                // inMemoryJwt.ereaseToken()
                throw new HttpError(response.message, response.code)
                // navigate('/')
            }
            // redirect('/')
        }   

        return getResults
    }
})


export const dataProvider = addRefreshAuthToDataProvider( baseDataProvider, refreshAuth)