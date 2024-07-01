import { Calendar, dateFnsLocalizer } from 'react-big-calendar'

import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'

import "react-big-calendar/lib/css/react-big-calendar.css"
import "./CalendarInterface.css"
import CalendarModal from '../modal/CalendarModal'

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

const CalendarInterface = ({ getPlannedEvents = {
   1 : { 
    id: 1,
    title: 'title',
    start: 0,
    end: 0,
    resource : 1
  }
}, clickHandle = () => {}}) => {
    
    const components = {
      event: (item = { event: { title: 'training'}}) => {
        const typeEvent = item?.event?.title
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