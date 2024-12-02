import { useCallback } from "react"
import { json, redirect } from "react-router-dom"
import { HttpError } from "react-admin"
import { ApiFetch } from "../js/util/postUtil.js"
import {ApiFetchGetOptions, deleteLocalStorageItem , getLocalStorageItem } from "../js/util/getUtil.js"
import inMemoryJwt from "../js/util/inMemoryJwt.js"
import { fetchUserCalendar } from "../hooks/query/usePublisedEvents.jsx"
import { usePublicCalendar } from "../hooks/query/usePublisedEvents.jsx"

export async function CalendarLoader()
{
    // const {blackDragonEvents, status } = usePublicCalendar()
    const ApiOptions = ApiFetchGetOptions(`/api/public/events`)    
    const request = await ApiFetch(ApiOptions)
    const blackDragonEvents = await request.json()

    if(!request.ok){    
        throw new HttpError('Excuse us, Black Dragon Events Not Found!', 404, response)          
    }   

    console.log('pulicEventsCalendar', blackDragonEvents)

    const response = blackDragonEvents['member'].map((response) => ({
        id: response.id,
        title: response.title,
        start: new Date(response.startDate),
        end: new Date(response.endDate),
        resource: response.description,
    }))

    return json({publicCalendar: response},{
        headers:{
            'Cache-Control': 'max-age=60, public',
        }
    })
    // return {publicCalendar: response}
}
