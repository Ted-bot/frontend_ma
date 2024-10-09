import { useCallback } from "react"
import { json, redirect } from "react-router-dom"
import { HttpError } from "react-admin"
import { ApiFetch } from "../js/util/postUtil.js"
import {ApiFetchGetOptions, deleteLocalStorageItem , getLocalStorageItem } from "../js/util/getUtil.js"
import { getAuthToken} from "../js/util/auth.js"

export async function CalendarLoader()
{
    const email = getLocalStorageItem('email')
    const token = getAuthToken()
    const ApiOptions = ApiFetchGetOptions(`/api/subscribe/${email}/events`,{'X-Authorization': token})
    
    const request = await ApiFetch(ApiOptions)
    const response = await request.json()   
    
    console.log({response: response})

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
