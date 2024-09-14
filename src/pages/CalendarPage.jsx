import {useState, useEffect, useCallback, useMemo, useRef} from 'react'
import MainContentWrap from '../components/wraps/client/MainContentWrap' 
import CalendarInterface from '../components/interface/CalendarInterface.jsx'

import { ApiFetchPostOptions, ApiFetch } from '../js/util/postUtil.js'
import {ApiFetchGetOptions} from "../js/util/getUtil.js"
import {getAuthToken} from "../js/util/auth.js"

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
    const token = getAuthToken()
    const dialog = useRef()
    

    useEffect(() => {
        getPlannedEvents()
    }, [])

    const getPlannedEvents = useCallback( 
        async () => {
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
        },[]
    )

    const handleSubmit = useCallback(
        async (event, id) => { 
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
    }, [token]
)

    const handleSelectEvent = useMemo(() => 
        (event) =>  { //unnessecary async removed
            // console.log({eventSelected: event})
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
        }
    )
        
    return(
        <>
        <CalendarModal ref={dialog} handleSubmit={(e) => handleSubmit(e)} {...showInModal} />
        <MainContentWrap name={wrapName}>
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
        </MainContentWrap>
    </>
    )
 }