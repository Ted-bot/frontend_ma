import { useQuery } from "react-query"
import { getLocalStorageItem, ApiFetchGetOptions } from "../../js/util/getUtil"
import { ApiFetch } from "../../js/util/postUtil"
import { HttpError } from "react-admin"
import inMemoryJwt from "../../js/util/inMemoryJwt.js"
import { dataProvider } from "../../dataProvider/main/DataProvider.jsx"

export const fetchUserCalendar = async () => {
    const email = getLocalStorageItem('email')
    // const token = inMemoryJwt.getToken()
    const ApiOptions = ApiFetchGetOptions(`/api/subscribe/${email}/events`,{'X-Authorization': inMemoryJwt.getToken()})
    
    const request = await ApiFetch(ApiOptions)
    const response = await request.json()   
    
    console.log({usePublishedResponse: response})

    if(!request.ok){
        throw new HttpError('Excuse us, Black Dragon Events Not Found!', 404, response)          
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
}

export const fetchPublicCalendar = async () => {
    const ApiOptions = ApiFetchGetOptions(`/api/public/events`)    
    const request = await ApiFetch(ApiOptions)
    const response = await request.json()

    if(!request.ok){    
        throw new HttpError('Excuse us, Black Dragon Events Not Found!', 404, response)          
    }   

    console.log('pulicEventsCalendar', response)

    const publicBlackDragonEvents = response['hydra:member'].map((response) => ({
        id: response.id,
        title: response.title,
        start: new Date(response.startDate),
        end: new Date(response.endDate),
        resource: response.description,
    }))

    return {publicCalendar: publicBlackDragonEvents}
}

export const usePublicCalendar = () => {
    const { data: publicCalendar, status } = useQuery({
        queryFn: fetchPublicCalendar,
        queryKey: ["publicCalendar"], 
        refetchOnWindowFocus: false,        
        refetchInterval: 60000,
        retry: 5,
    })

    return {publicCalendar: publicCalendar, status: status}
}


export const useUserCalendar = () => {
    const { data: userCalendar, status } = useQuery({
        queryFn: fetchUserCalendar,
        queryKey: ["userCalendar"], 
        refetchOnWindowFocus: false,        
        // refetchInterval: 60000,
        retry: 5,
})
    // const { data: userCalendar, status } = useQuery({queryKey:['userCalendar'], queryFn: fetchUserCalendar, refetchInterval: 6000})

    return {blackDragonEvents: userCalendar, status: status}
}

export const useUserSelectedEvents = (email, params) => {
    const { data: events, status, refetch } = useQuery({
        queryFn: () => dataProvider.getUserRegisteredEvents('registered_events', email),
        queryKey: ["userSelectedEvents"], 
        refetchOnWindowFocus: false,     
        // refetchInterval: 600,
        retry: 1,
})
    // const { data: userCalendar, status } = useQuery({queryKey:['userCalendar'], queryFn: fetchUserCalendar, refetchInterval: 6000})

    return {events, status, refetch}
}

export const useUserIdentifier = () => {
    const { data: userIdentity, status } = useQuery({
        queryFn: getUserIdentity,
        queryKey: ["userIdentifier"], 
        refetchOnWindowFocus: false,        
        // refetchInterval: 60000,
        // retry: 5,
})
    // const { data: userCalendar, status } = useQuery({queryKey:['userCalendar'], queryFn: fetchUserCalendar, refetchInterval: 6000})

    return {dragonUser: userIdentity, status: status}
}
