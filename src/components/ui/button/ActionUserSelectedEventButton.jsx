import { getLocalStorageItem } from '../../../js/util/getUtil'
import { ApiFetchPostOptions, ApiFetch} from '../../../js/util/postUtil'
import { getAuthToken } from '../../../js/util/auth'
import { useMutation, useQueryClient } from 'react-query'
// import { useAddToUserCalendar } from '../../../hooks/query/usePublisedEvents'

export const ActionUserSelectedEventButton = ({id, setResponse}) => {

    const token = getAuthToken()
    const email = getLocalStorageItem('email')
    const queryClient = useQueryClient()
    const buttonStyle = "text-slate-100 h-16 w-42 px-8 rounded-b-full rounded-t-full border-0 ring-2 shadow-xl ring-red-500 bg-red-500 bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300 hover:from-orange-400 hover:text-yellow-200 hover:to-red-400 hover:ring-red-400 hover:shadow-2xl"

    const {mutateAsync: subscribeToEvent, isLoading, isFetching} = useMutation({
        // ignoreResults: true,
        // reset: false,
        mutationFn: async (id) => {        
           const postUserSelectedEvent = await fetch(`/api/subscribe/${email}/event/${id}`,{
                method:'POST',
                headers: {
                    "Content-Type":"application/json",
                    'X-Authorization': token
                },
                body: JSON.stringify({event_id:id})}
            )
            return await postUserSelectedEvent.json()
        },
        // onSuccess: () => console.log('Yes it Worked Horaay!'),
        onSuccess: (data) => {
            console.log({newData: data["showUserSelectedEvent"]})
            queryClient.invalidateQueries(["userCalendar"])
            delete data["showUserSelectedEvent"]
            setResponse(data)
        },
        // onSuccess: async () => await queryClient.invalidateQueries({queryKey: ['userCalendar']}),
        // queryClient: queryClient
    })
    if(isLoading) return <button className={buttonStyle + 'text-xl '}>....is Loading!!</button>
    
    return (
        <>
            {isFetching && <div>....Yes success!</div>}
            <section className="flex flex-inline justify-center mt-8">
                <form onSubmit={() => subscribeToEvent(id) }>
                    <button 
                        className={buttonStyle + ' text-2xl '}
                    >
                       { isLoading ? '....is Loading' :'Sign Up'}
                    </button>
                </form>
            </section>
        </>
    )
}