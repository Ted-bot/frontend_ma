import { Calendar, dateFnsLocalizer } from 'react-big-calendar'

import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'

import { getToken } from '../../js/util/postUtil'

import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = {
  'en-US': enUS,
}

const token = getToken()

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})
  export default function CalendarInterface({getPlannedEvents, clickHandle}){

      return (
        <Calendar
          localizer={localizer}
          events={getPlannedEvents}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={clickHandle}
          style={{ height: 500 }}
        />
      )
}