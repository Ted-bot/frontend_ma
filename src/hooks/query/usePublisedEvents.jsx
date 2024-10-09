import { useQuery } from "react-query"
import { useCallback } from "react"
import { getAuthToken } from "../../js/util/auth"
import { getLocalStorageItem, ApiFetchGetOptions } from "../../js/util/getUtil"
import { ApiFetch, ApiFetchPostOptions } from "../../js/util/postUtil"
import { HttpError } from "react-admin"

export const email = getLocalStorageItem('email')
export const token = getAuthToken()

const fetchUserCalendar = async () => {
    const email = getLocalStorageItem('email')
    const token = getAuthToken()
    const ApiOptions = ApiFetchGetOptions(`/api/subscribe/${email}/events`,{'X-Authorization': token})
    
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

export const useUserCalendar = () => {
    const { data: userCalendar, status } = useQuery({
        queryFn: fetchUserCalendar,
        queryKey: ["userCalendar"], 
        refetchOnWindowFocus: false,        
        refetchInterval: 60000,
        retry: 5,
})
    // const { data: userCalendar, status } = useQuery({queryKey:['userCalendar'], queryFn: fetchUserCalendar, refetchInterval: 6000})

    return {blackDragonEvents: userCalendar, status: status}
}

// const handleSubmit = async (id) => { 
//     const email = getLocalStorageItem('email')
//     const token = getAuthToken()

//     const ApiOptions = ApiFetchPostOptions({url: '/api/subscribe/events', method:'POST'}, {event_id: id},{'X-Authorization': token})
    
//     // console.log({eventChosen : id})

//     // try{
//         const request = await ApiFetch(ApiOptions)
//         const response = await request.json()

//         if(!request.ok) throw new HttpError( "Something went wrong subscribing you to an event :( " , response.status)

//             console.log({WhatKrijgIkTerug: response})
//         if(response?.message) return response
        
        
//         // if(request.error) return setResponseRequest(response) 

//     // } catch (error){
//     //     console.log({SubscribeEventError: error})
//     //     // showBoundary(error)
//     // }
// }
// // export const id = {id:0}
// export const useAddToUserCalendar = (id) => {
//     const id = id
//     const { addToUserCalendar, status } = useQuery({
//         queryKey: ["addToUserCalendar"], 
//         queryFn: (id) => {        
//             fetch(`/api/subscribe/${email}/event/${id}`,{
//                  method:'POST',
//                  headers: {
//                      "Content-Type":"application/json",
//                      'X-Authorization': token
//                  },
//                  body: JSON.stringify({event_id:id})}
//              )
//          }
//         // refetch: 6000
//     })

//     return {addToUserCalendar, status: status}
// }



// queryClient.invalidateQueries('userCalendar')