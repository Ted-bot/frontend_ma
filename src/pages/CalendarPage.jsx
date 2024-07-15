import {useState, useEffect, useCallback, useRef} from 'react'
import FeatureCardsWrap from '../components/wraps/client/FeatureCardsWrap' 
import CalendarInterface from '../components/interface/CalendarInterface.jsx'
import { ApiFetchGetOptions, ApiFetchPostOptions, ApiFetch, getToken } from '../js/util/postUtil'
import { PostError } from '../js/error/PostError'

import CalendarModal from '../components/modal/CalendarModal.jsx'

export default function CalendarPage(){
    
    const wrapName = 'Calendar'
    const [plannedEvents, setPlannedEvents] = useState([])
    const [responseRequest, setResponseRequest] = useState(null)
    const [showInModal, setShowInModal] = useState({
        title: '',
        startDateTime: '',
        endTime: '',
    })
    const token = getToken()
    const dialog = useRef()
    const options = { month: 'short', day: 'numeric' }

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
            resource: response.description,
        }))

        console.log({loadingEvents : events})

        setPlannedEvents(events)
    }

    const handleSubmit = async (event, id) => { 
        event.preventDefault()
        const ApiOptions = ApiFetchPostOptions({url: '/api/subscribe/events', method:'POST'}, {event_id: id},{'X-Authorization': 'Bearer ' + token})
        
        console.log({eventChosen : id})

        try{
            const request = await ApiFetch(ApiOptions)
            const response = await request.json()

            if(!response.ok)
            { //if(response.status >= 400 && response.status <= 600)
                // const errorJson = await response.json()
                throw new PostError('Api: Subscribe to Calendar error', response)
            }

            if(response?.success){
                return setResponseRequest(() => (response.success))
            }

            if(response?.error){
                return setResponseRequest(() => (response.error))
            }
        } catch (error){
            console.log({SubscribeEventError: error})
        }

    }

    const handleSelectEvent = useCallback(
        async (event) =>  {
            // console.log({eventSelected: event})

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

            setShowInModal((prevValues) => {
                return {
                    id: event.id,
                    title: event.title,
                    description: event.description,
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
            <CalendarModal ref={dialog} handleSubmit={(e) => handleSubmit(e)} {...showInModal} />
            <FeatureCardsWrap name={wrapName}>
                <>
                    {responseRequest != null && 
                        <section className={Object.keys(responseRequest)[0] =! 'error' ? 'red-100 border border-red-400 text-red-700' : 'green-100 border border-green-400 text-green-700'}>
                            {responseRequest}
                        </section>
                    }
                    <CalendarInterface 
                        getPlannedEvents={plannedEvents}
                        clickHandle={handleSelectEvent} 
                    />
                </>    
            </FeatureCardsWrap>
        </>
    )
 }