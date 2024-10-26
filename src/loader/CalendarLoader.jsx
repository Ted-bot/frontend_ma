import { useCallback } from "react"
import { json, redirect } from "react-router-dom"
import { HttpError } from "react-admin"
import { ApiFetch } from "../js/util/postUtil.js"
import {ApiFetchGetOptions, deleteLocalStorageItem , getLocalStorageItem } from "../js/util/getUtil.js"
import inMemoryJwt from "../js/util/inMemoryJwt.js"
import { fetchUserCalendar } from "../hooks/query/usePublisedEvents.jsx"

export async function CalendarLoader()
{
    // return await fetchUserCalendar()
    const email = getLocalStorageItem('email')
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3Mjk4MDMyMDksImV4cCI6MTcyOTgzOTIwOSwicm9sZXMiOlsiUk9MRV9VU0VSX1NUVURFTlQiXSwidXNlcm5hbWUiOiJ0a2JvdGNoQGdtYWlsLmNvbSJ9.a2ycLWwQnjVBdDmmtUaLp5LRUjlCHuE7o5oEtlUs8Zho9EntKW02U3L_DB6z6anCTYnm0j5y4s0zr4k36xVH9MOU0xWl6zE5-NEkwCSH6ks-ienn0dFzeQK4UYBq_EUQtn17jUWHiJLipTHMe2CcD1W9IsnDOjETNrzWPh38Z7UT442CasV5KlEbIBu_QbjL6QBRgYpWv4Thz6j3jOcZEsoGRdqZgVa6a1F7nRY_yDIP3fpGldQUVDXpezwxZdTmrlszrXmq7DZ3k0mKLNl_0tX1qeyIDPGRfhQnV5qCKTBnE2uZokjHBocZpTm2qfv_4jkdY6aRuFJhoRHPsx6NZw'
    // const token = inMemoryJwt.getToken()
    const ApiOptions = ApiFetchGetOptions(`/api/subscribe/${email}/events`,{'X-Authorization': token})
    
    const request = await ApiFetch(ApiOptions)
    const response = await request.json()   
    
    console.log({response: response})

    if(!request.ok){
        throw new HttpError('Shit, Black Dragon Events Not Found!', 404, response)          
        // throw new HttpError('Excuse us, Black Dragon Events Not Found!', 404, response)          
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
