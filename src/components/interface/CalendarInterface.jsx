import React, {useState} from 'react'
import { Calendar, dateFnsLocalizer, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import IconBxCheck from '../../assets/IconBxCheck'

import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import nl from 'date-fns/locale/nl'

import "react-big-calendar/lib/css/react-big-calendar.css"
import "./CalendarInterface.css"

const locales = {
  'nl': nl,
}

// const Datelocalizer = dateFnsLocalizer({
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// })

const localizer = momentLocalizer(moment) 
//'Europe/Amsterdam'

const defaultPlannedEvents = [
  {
    id: 0,
    title: 'training',
    start: 0,
    end: 0,
    resource : 1
 },
 {
    id: 1,
    title: 'training',
    start: 0,
    end: 0,
    resource : 1
   }
]

const CalendarInterface = ({getPlannedEvents = defaultPlannedEvents, userSelectedEvents = [{id: 0}], clickHandle = () => {}}) => {    
    
  const components = {
    event: ({ event }) => {
      const {id, title: typeEvent} = event
  
      if(userSelectedEvents.includes(id)) {
        return ( <div style={{ display: 'inline-flex', justifyContent: 'center' ,backgroundColor: '#a6a6a6', color: '#004e00', fontWeight: 500, fontSize: 18, width: '100%' }}>{<IconBxCheck />} {typeEvent}</div>)
      }
  
      switch(typeEvent){
        case 'special':
          return( <div style={{ backgroundColor: '#d73052', color: 'white' }}>{typeEvent}</div>)
        case 'training':
          return( <div style={{ backgroundColor: '#ffb732', color: '#444444' }}>{typeEvent}</div>)
        case 'expeditie':
          return( <div style={{ backgroundColor: '#00ffa5', color: '#674ea7' }}>{typeEvent}</div>)
        default: 
          return ( <div style={{ backgroundColor: '#f0f8ff', color: 'f0f8ff' }}>{typeEvent}</div>)
      }
    }
  }

  return (<Calendar
      localizer={localizer}
      events={getPlannedEvents}
      startAccessor="start"
      endAccessor="end"
      components={components}
      onSelectEvent={clickHandle}
      defaultView={'agenda'}
      views={['agenda', 'week']}
      style={{ height: 500 }}
    />)
}


export default CalendarInterface