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

 const CalendarModal = forwardRef(function CalendarModal({ id, day, title,description, start, end, setResponseRequest}, ref){
    let setTypeEvent
    const dialog = useRef()
    const queryClient = useQueryClient()

    // const token = getAuthToken()
    // const [responseRequest, setResponseRequest] = useState(null)

    useImperativeHandle(ref, () => {

        return {
            open(){
                dialog.current.showModal()
            }
        }
    })

    // const {addToUserCalendar} = useAddToUserCalendar()
    // const token = getAuthToken()
    
    
    // const email = getLocalStorageItem('email')
    
    
    // const {mutateAsync: subscribeToEvent} = useMutation({
    //     mutationFn: (id) => {        
    //        fetch(`/api/subscribe/${email}/event/${id}`,{
    //             method:'POST',
    //             headers: {
    //                 "Content-Type":"application/json",
    //                 'X-Authorization': token
    //             },
    //             body: JSON.stringify({event_id:id})}
    //         )
    //     },
    //     reset: false,
    //     queryClient: queryClient
    // })

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

    // console.log({showSubscribeEventResponse: responseRequest})

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
                    <Grid 
                        container 
                        direction="column"
                        sx={{ flexGrow: 1}}
                    >
                        <Box
                            width={{ xs:'8rem', sm:'8rem', md:'7rem', lg:'7rem'}}
                            // paddingTop={{ xs:'1rem' }}                            
                        >
                            <h1 className='text-center text-md text-orange-200 sm:text-xl lg:py-10'>
                                Day Event :
                            </h1>
                        </Box>
                        <Box 
                            width={{ xs:'8rem', sm:'8rem', md:'7rem', lg:'7rem'}}                            
                        >
                            <h1 className='text-center text-md text-orange-200 sm:text-xl lg:py-10'>
                                start time :
                            </h1>
                        </Box>
                        <Box 
                            width={{ xs:'8rem', sm:'8rem', md:'7rem', lg:'7rem'}}                            
                        >
                            <h1 className='text-center text-md text-orange-200 sm:text-xl lg:py-10'>
                                end time :
                            </h1>
                        </Box>
                    </Grid>
                    <Grid 
                        container
                        direction="column"
                        sx={{ flexGrow: 1 }}
                    >
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
                <ActionUserSelectedEventButton id={id} setResponse={setResponseRequest}/>
                {/* <section className="flex flex-inline justify-center mt-8">
                    <form onSubmit={() => subscribeToEvent(id) }>
                        <button 
                            className="text-slate-100 h-16 w-42 px-8 rounded-b-full text-2xl rounded-t-full border-0 ring-2 shadow-xl ring-red-500 bg-red-500 bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300 hover:from-orange-400 hover:text-yellow-200 hover:to-red-400 hover:ring-red-400 hover:shadow-2xl"
                        >
                            Sign Up
                        </button>
                    </form>
                </section> */}
            </section>
        </dialog>,
        document.getElementById("modal")
    )
})

export default CalendarModal