export const reformatDateItems = (events) => {
    return events?.map(function (event) {
        const startUtcDate = new Date(event.start)
        const endUtcDate = new Date(event.end)
        
        return {
          ...event,
          start: new Date(startUtcDate.getFullYear(), startUtcDate.getMonth(), startUtcDate.getDate(), startUtcDate.getUTCHours(), startUtcDate.getMinutes(), 0),
          end: new Date(endUtcDate.getFullYear(), endUtcDate.getMonth(), endUtcDate.getDate(), endUtcDate.getUTCHours(), endUtcDate.getMinutes(), 0)
        }
      })
    }

export const reformatSingleDateItem = (event) => {
        const startUtcDate = new Date(event.start)
        const endUtcDate = new Date(event.end)
        
        return {
            ...event,
            start: new Date(startUtcDate.getFullYear(), startUtcDate.getMonth(), startUtcDate.getDate(), startUtcDate.getUTCHours(), startUtcDate.getMinutes(), 0),
            end: new Date(endUtcDate.getFullYear(), endUtcDate.getMonth(), endUtcDate.getDate(), endUtcDate.getUTCHours(), endUtcDate.getMinutes(), 0)
        }
    }

export const reformatTimeUnit = (event) => {
    const startUtcDate = new Date(event)
    
    return {
        ...event,
        time: new Date(startUtcDate.getFullYear(), startUtcDate.getMonth(), startUtcDate.getDate(), startUtcDate.getUTCHours(), startUtcDate.getMinutes(), 0),
    }
}

export const reformatEditTimeUnit = (event) => {
    const startUtcDate = new Date(event)
    
    return {
        ...event,
        time: new Date(startUtcDate.getDate(), startUtcDate.getMonth(),startUtcDate.getFullYear(),  startUtcDate.getUTCHours(), startUtcDate.getMinutes(), 0),
    }
}