import {useState, useEffect} from 'react'
import FeatureCardsWrap from '../components/wraps/client/FeatureCardsWrap'; 
import CalendarEvents from '../components/interface/Calendar';
import { ApiFetchGetOptions, ApiFetch, getToken } from '../js/util/postUtil';
import { PostError } from '../js/error/PostError';

import CalendarModal from '../components/modal/CalendarModal.jsx'

export default function CalendarPage(){

    const [plannedEvents, setPlannedEvents] = useState([])
    const token = getToken()

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
            title: response.title,
            start: new Date(response.startDate),
            end: new Date(response.endDate),
            resource: response.relatedUser,
        }))

        setPlannedEvents(events)
    }

    console.log({plannedEvents: plannedEvents})
    
    return(
        <>
            <CalendarModal title={'test'} start='12 AM' end='2 PM' />
            <FeatureCardsWrap>    
                <CalendarEvents 
                    getPlannedEvents={plannedEvents}  
                />
            </FeatureCardsWrap>
        </>
    )
 }