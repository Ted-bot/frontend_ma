import {useState, useEffect, useMemo, useRef } from 'react'
import MainContentWrap from '../components/wraps/client/MainContentWrap' 
import CalendarInterface from '../components/interface/CalendarInterface.jsx'

import CalendarModal from '../components/modal/CalendarModal.jsx'
import { useUserCalendar } from '../hooks/query/usePublisedEvents.jsx'
import { useQueryClient } from 'react-query'
import inMemoryJwt from '../js/util/inMemoryJwt.js'
import { useLoaderData } from 'react-router-dom'

export default function CalendarPage(){
    // const {blackDragonEvents, status } = useUserCalendar()
    const blackDragonEvents = useLoaderData()
    // const queryClient = useQueryClient()
    const wrapName = 'Calendar'
    const token = inMemoryJwt.getToken()
    const dialog = useRef()
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

    useEffect(() => {
        blackDragonEvents?.events && setPlannedEvents(blackDragonEvents?.events)
        blackDragonEvents?.userSelectedEvents && setUserSelectedEvents(blackDragonEvents?.userSelectedEvents)
    }, [blackDragonEvents])//responseRequest?.message


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

            const allReadySelected = userSelectedEvents.find((eventId) => eventId === event.id)
            
            setShowInModal(() => ({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    day: extractDay,
                    start: startTimeEvent,
                    end: endTimeEvent,
                    allReadySelected: !!allReadySelected,
                })
            )
        }
    )

    const standardSyle = 'p-4 mb-8 rounded-md text-center'

    return(
        <>
            <CalendarModal ref={dialog} setResponseRequest={setResponseRequest}  {...showInModal} />
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