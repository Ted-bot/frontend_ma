import { getLocalStorageItem } from '../../../js/util/getUtil'
import { ApiFetchPostOptions, ApiFetch} from '../../../js/util/postUtil'
import { useMutation, useQueryClient } from 'react-query'
import inMemoryJwt from '../../../js/util/inMemoryJwt.js'
import { HttpError, useNotify } from 'react-admin'
// import { useAddToUserCalendar } from '../../../hooks/query/usePublisedEvents'

export const ActionUserSelectedEventButton = ({id, buttonText, setResponse, select}) => {

    const token = inMemoryJwt.getToken()
    const notify = useNotify()
    const email = getLocalStorageItem('email')
    const queryClient = useQueryClient()
    const buttonStyle = "text-slate-100 h-16 w-42 px-8 rounded-b-full rounded-t-full border-0 ring-2 shadow-xl ring-red-500 bg-red-500 bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300 hover:from-orange-400 hover:text-yellow-200 hover:to-red-400 hover:ring-red-400 hover:shadow-2xl"

    const {mutateAsync: subscribeToEvent, isLoading, isFetching} = useMutation({
        mutationFn: async (id) => {        
           const postUserSelectedEvent = await fetch(`/api/subscribe/${email}/event/${id}`,{
                method:'POST',
                headers: {
                    "Content-Type":"application/json",
                    'X-Authorization': token
                },
                body: JSON.stringify({event_id: id, select: select})}
            )

            const response = await postUserSelectedEvent.json()

            if(!postUserSelectedEvent.ok) throw new HttpError(response.detail,response.status)

            return response
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["userCalendar"])
            setResponse(data)
        },
        onError: (data) => {
            setResponse(data)
            console.log('errorAccess',data)
            // notify(data.detail, {type: 'error'})
        }
    })
    if(isLoading) return  <section className="flex flex-inline justify-center mt-8">
        <button className={buttonStyle + 'text-xl '}>...is Loading!!</button>
    </section>
    
    return (
        <>
            {/* {isFetching && <div>....Yes success!</div>} */}
            <section className="flex flex-inline justify-center mt-8">
                <form onSubmit={() => subscribeToEvent(id) }>
                    <button 
                        className={buttonStyle + ' text-2xl '}
                    >
                       { isLoading ? '....is Loading' : buttonText}
                    </button>
                </form>
            </section>
        </>
    )
}