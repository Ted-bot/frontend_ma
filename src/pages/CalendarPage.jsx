import {useState, useEffect, useCallback, useRef} from 'react'
import FeatureCardsWrap from '../components/wraps/client/FeatureCardsWrap' 
import CalendarInterface from '../components/interface/CalendarInterface.jsx'
import { ApiFetchGetOptions, ApiFetchPostOptions, ApiFetch, getToken } from '../js/util/postUtil'
import { PostError } from '../js/error/PostError'

import CalendarModal from '../components/modal/CalendarModal.jsx'

export default function CalendarPage(){

    const wrapName = 'Calendar'
    const [plannedEvents, setPlannedEvents] = useState([])
    const [showInModal, setShowInModal] = useState({
        title: '',
        startDateTime: '',
        endTime: '',
    })
    const token = getToken()
    const dialog = useRef()

    useEffect(() => {
        getPlannedEvents()
    }, [])

    const getPlannedEvents = async () => {
        const getOptions = ApiFetchGetOptions('/api/trainingsessions',{'X-Authorization': 'Bearer ' + token})
        const getResults = await ApiFetch(getOptions)
        const response = await getResults.json()
        
        if(!getResults.ok)
        {
            throw new PostError('Api Login error', response)  
        }

        const events = response['hydra:member'].map((response) => ({
            id: response.id,
            title: response.title,
            start: new Date(response.startDate),
            end: new Date(response.endDate),
            resource: response.relatedUser,
        }))

        setPlannedEvents(events)
    }

    const handleSelectEvent = useCallback(
        async (event) =>  {
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

            setShowInModal((prevValues) => {
                return {
                    title: event.title,
                    day: extractDay,
                    start: startTimeEvent,
                    end: endTimeEvent
                }
            })
        },
        []
    )

    return(
        <>
            <CalendarModal ref={dialog} {...showInModal} />
            <FeatureCardsWrap name={wrapName}>    
                <CalendarInterface 
                    getPlannedEvents={plannedEvents}
                    clickHandle={handleSelectEvent}  
                />
            </FeatureCardsWrap>
        </>
    )
 }