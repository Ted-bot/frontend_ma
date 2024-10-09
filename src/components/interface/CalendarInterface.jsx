import React, {useState} from 'react'
import { Calendar, dateFnsLocalizer} from 'react-big-calendar'

import IconBxCheck from '../../assets/IconBxCheck'

import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import moment from 'moment/moment'

import "react-big-calendar/lib/css/react-big-calendar.css"
import "./CalendarInterface.css"

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// const [selected, setSelected] = useState([])


const defaultPlannedEvents = {
  1 : { 
   id: 1,
   title: 'title',
   start: 0,
   end: 0,
   resource : 1
 }
}

const selectedPlannedEvents = [1, 3, 5, 8, 10 ,12 ,17 ,18, 21]

// const slotPropGetter = (slotDate, isSelected) => {
//   const isOverlap = selectedPlannedEvents.includes(slotDate.id)
//   if(isOverlap) return {style: { backgroundColor: '#000', color: '#f2f2f2' }}
// };

const CalendarInterface = ({getPlannedEvents = defaultPlannedEvents, userSelectedEvents = [{id: 0}], clickHandle = () => {}} = {}) => {    
    
  const components = {
    event: (item = { event: { title: 'training'}}) => {
      const typeEvent = item?.event?.title
  
      if(userSelectedEvents.includes(item?.event?.id)) {
        return ( <div style={{ display: 'inline-flex', justifyContent: 'center' ,backgroundColor: '#a6a6a6', color: '#004e00', fontWeight: 500, fontSize: 18, width: '100%' }}>{<IconBxCheck />} {typeEvent}</div>)
      }
  
      switch(typeEvent){
        case 'special':
          return( <div style={{ backgroundColor: '#d73052', color: 'white' }}>{typeEvent}</div>)
        case 'training':
          return( <div style={{ backgroundColor: '#ffb732', color: '#444444' }}>{typeEvent}</div>)
        case 'expeditie':
          return( <div style={{ backgroundColor: '#00ffa5', color: '#674ea7' }}>{typeEvent}</div>)
      }
    }
  }

  return (<Calendar
      // eventPropGetter={slotPropGetter}
      // selected={selectedPlannedEvents}
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