import { forwardRef, useImperativeHandle, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Box from '@mui/material/Box'
// import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import './CalendarModal.css'
// import { getLocalStorageItem } from '../../js/util/getUtil'
// import { ApiFetchPostOptions, ApiFetch} from '../../js/util/postUtil'
// import { getAuthToken } from '../../js/util/auth'
// import { useAddToUserCalendar } from '../../hooks/query/usePublisedEvents'

import { useQueryClient, useMutation } from 'react-query'
import { ActionUserSelectedEventButton } from '../ui/button/ActionUserSelectedEventButton';

 const CalendarModal = forwardRef(function CalendarModal({ id, day, title,description, start, end, setResponseRequest, allReadySelected}, ref){
    let setTypeEvent
    const dialog = useRef()

    useImperativeHandle(ref, () => {

        return {
            open(){
                dialog.current.showModal()
            }
        }
    })

    const buttonTextSubscribe = 'Sign up'
    const buttonTextUnsubscribe = 'cancell'

    const typeEvent = (title)  => {
        switch(title){
            case 'training':
                setTypeEvent = 'text-amber-400';
                break
            case 'special':
                setTypeEvent = 'text-rose-300';
                break
            case 'expeditie':
                setTypeEvent = 'text-teal-400';
                break
        }

        return setTypeEvent
    }

    return createPortal(
        <dialog ref={dialog} className="result-modal">
            <section>
                <form method="dialog" className="flex w-4 float-right justify-end">
                    <button className='px-2 rounded-md hover:border-2 hover:border-rose-500 hover:bg-rose-300'>X</button>
                </form>
                <h1 className={`text-center underline underline-offset-4 pb-4 text-2xl ${typeEvent(title)}`}>{title}</h1>
            </section>
            <section className='w-full text-center text-slate-300'>
                {description}
            </section>

            <section>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    <Grid container direction="column" sx={{ flexGrow: 1}} >
                        <Box width={{ xs:'8rem', sm:'8rem', md:'7rem', lg:'7rem'}}>
                            <h1 className='text-center text-md text-orange-200 sm:text-xl lg:py-10'>
                                Day Event :
                            </h1>
                        </Box>
                        <Box width={{ xs:'8rem', sm:'8rem', md:'7rem', lg:'7rem'}} >
                            <h1 className='text-center text-md text-orange-200 sm:text-xl lg:py-10'>
                                start time :
                            </h1>
                        </Box>
                        <Box width={{ xs:'8rem', sm:'8rem', md:'7rem', lg:'7rem'}} >
                            <h1 className='text-center text-md text-orange-200 sm:text-xl lg:py-10'>
                                end time :
                            </h1>
                        </Box>
                    </Grid>
                    <Grid container direction="column" sx={{ flexGrow: 1 }}>
                        <Box 
                            width={{ xs:'8rem', sm:'8rem', md:'7rem', lg:'7rem'}}  
                            alignContent="center"
                        >
                            <h1 className='text-center text-md text-rose-400 sm:text-xl lg:py-10'>
                                {day}   
                            </h1>
                        </Box>                        
                        <Divider variant="middle" component="div"  />                        
                        <Box 
                            width={{ xs:'8rem', sm:'8rem', md:'7rem', lg:'7rem'}}  
                            alignContent="center"
                        >
                            <h1 className='text-center text-md text-rose-400 sm:text-xl lg:py-10'>
                                {start}
                            </h1>
                        </Box>    
                        <Divider variant="middle" component="div"  />
                        <Box 
                            width={{ xs:'8rem', sm:'8rem', md:'7rem', lg:'7rem'}}  
                            alignContent="center"
                        >
                            <h1 className='text-center text-md text-rose-400 sm:text-xl lg:py-10'>
                                {end}
                            </h1>
                        </Box>    
                        <Divider variant="middle" component="div"  />
                    </Grid>
                </Box>
                {
                    allReadySelected
                    ? <ActionUserSelectedEventButton id={id} buttonText={buttonTextUnsubscribe} setResponse={setResponseRequest} select={0}/>
                    : <ActionUserSelectedEventButton id={id} buttonText={buttonTextSubscribe} setResponse={setResponseRequest} select={1}/>
                }
            </section>
        </dialog>,
        document.getElementById("modal")
    )
})

export default CalendarModal