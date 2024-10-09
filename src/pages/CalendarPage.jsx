import {useState, useEffect, useCallback, useMemo, useRef, createContext, useContext} from 'react'
import MainContentWrap from '../components/wraps/client/MainContentWrap' 
import CalendarInterface from '../components/interface/CalendarInterface.jsx'

import { ApiFetchPostOptions, ApiFetch } from '../js/util/postUtil.js'
import {ApiFetchGetOptions, getLocalStorageItem} from "../js/util/getUtil.js"
import {getAuthToken} from "../js/util/auth.js"
import CalendarModal from '../components/modal/CalendarModal.jsx'
import { useErrorBoundary } from "react-error-boundary"
import { useLoaderData, Form, useNavigate } from 'react-router-dom'
import { useUserCalendar } from '../hooks/query/usePublisedEvents.jsx'
import { useQueryClient, useMutation } from 'react-query'

import { HttpError } from 'react-admin'

export default function CalendarPage(){
    const {blackDragonEvents, status } = useUserCalendar()
    const queryClient = useQueryClient()
    // const loaderData = useLoaderData()
    const wrapName = 'Calendar'
    const token = getAuthToken()
    const dialog = useRef()
    const {showBoundary} = useErrorBoundary()
    const dummyPlannedEvent = { 
        id: 1,
        title: 'title',
        start: 0,
        end: 0,
        resource : 1
      }
    const [plannedEvents, setPlannedEvents] = useState([dummyPlannedEvent])
    const [userSelectedEvents, setUserSelectedEvents] = useState([dummyPlannedEvent])
    const [responseRequest, setResponseRequest] = useState(null)
    const [showInModal, setShowInModal] = useState({
        title: '',
        startDateTime: '',
        endTime: '',
    })

    
    // console.log({newData: blackDragonEvents, status: status})

    useEffect(() => {
        blackDragonEvents?.events && setPlannedEvents(blackDragonEvents?.events)
        blackDragonEvents?.userSelectedEvents && setUserSelectedEvents(blackDragonEvents?.userSelectedEvents)
    }, [blackDragonEvents])//responseRequest?.message

    
    // const handleSubmit = useCallback(
    //     async (event, id) => { 
    //     event.preventDefault()
    //     const ApiOptions = ApiFetchPostOptions({url: '/api/subscribe/events', method:'POST'}, {event_id: id},{'X-Authorization': token})
        
    //     // console.log({eventChosen : id})

    //     try{
    //         const request = await ApiFetch(ApiOptions)
    //         const response = await request.json()

    //         if(!request.ok) throw new HttpError( "Something went wrong subscribing you to an event :( " , response.status)

    //             console.log({WhatKrijgIkTerug: response})
    //         if(response?.message) return setResponseRequest(response) 
            
            
    //         // if(request.error) return setResponseRequest(response) 

    //     } catch (error){
    //         console.log({SubscribeEventError: error})
    //         showBoundary(error)
    //     }
    // }, [token])



    const handleSelectEvent = useMemo(() => 
        (event) =>  { 
            const options = { month: 'short', day: 'numeric' }
            const selectedDate = new Date(event.start).toLocaleDateString('en-us', options)
            
            if(event.start < new Date()){
                let text = `This ${event.title} on ${selectedDate} has already passed!\nPlease selected one of the upcoming available dates`
                window.alert(text)
                return
            }
            
            dialog.current.open()
            const extractStartTimeEvent = new Date(event.start)
            const extractEventTimeEnd = new Date(event.end)
            
            const extractDay = extractStartTimeEvent.toDateString()
            const extractStartTimeHours = extractStartTimeEvent.getHours()
            const extractStartTimeMin = extractStartTimeEvent.getMinutes()
            const startTimeEvent = extractStartTimeHours + ':' + extractStartTimeMin
            
            const extractEndTimeHours = extractEventTimeEnd.getHours()
            const extractEndTimeMin = extractEventTimeEnd.getMinutes()
            const endTimeEvent = extractEndTimeHours + ':' + extractEndTimeMin
            
            setShowInModal(() => ({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    day: extractDay,
                    start: startTimeEvent,
                    end: endTimeEvent
                })
            )
        }
    )

    const standardSyle = 'p-4 mb-8 rounded-md text-center'

    console.log({responseSelectEvent:userSelectedEvents })
    const propsInsert = {
        getPlannedEvents: plannedEvents, 
        clickHandle: handleSelectEvent
    }

    console.log({plannedEvents: plannedEvents})
    console.log({SeeResponseMessage: responseRequest})
    return(
        <>
            <CalendarModal ref={dialog} setResponseRequest={setResponseRequest}  {...showInModal} />
            {/* <CalendarModal ref={dialog} handleSubmit={subscribeToEvent} {...showInModal} /> */}
            {/* <CalendarModal ref={dialog} handleSubmit={async (event) => (subscribeToEvent({event}))} {...showInModal} /> */}
            <MainContentWrap name={wrapName}>
                <div className='flex-col'>
                    {responseRequest?.message != null && 
                        <section className={responseRequest.status >= 399 ? `bg-red-300 border border-red-400 text-red-700 ${standardSyle}` :`bg-green-300 border border-green-400 text-green-700 ${standardSyle}`}>
                            {responseRequest.message}
                        </section>
                    }
                    <CalendarInterface
                        getPlannedEvents={plannedEvents}
                        userSelectedEvents={userSelectedEvents}
                        clickHandle={handleSelectEvent} 
                        />
                </div>    
            </MainContentWrap>
        </>
    )
 }