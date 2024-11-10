import { useState, useEffect } from "react"
import { Box, Fab, CircularProgress } from '@mui/material'
import { red } from '@mui/material/colors'
import { CancelOutlined, Warning } from '@mui/icons-material'
import { dataProvider } from "../../../dataProvider/main/DataProvider"
import { useNotify } from "react-admin"
import inMemoryJwt from "../../../js/util/inMemoryJwt"
import { useMutation, useQueryClient } from 'react-query'

const ActionUserBlackDragonEventButton = ({params, email, updater}) => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const token = inMemoryJwt.getToken()
    
    const queryClient = useQueryClient()
    const notify = useNotify()

    const {mutateAsync: unSubscribeEvent, isLoading, isFetching} = useMutation({
        mutationFn: async (id) => {      
            console.log('gotPrams',id)
            return await dataProvider.userSelectedBlackDragonEvents('subscribe', {id: params.id, email:email},{event_id: params.id, select: 0})  
            // const postUserSelectedEvent = 
            // const token = inMemoryJwt.getToken()
            // return await fetch(`/api/subscribe/${email}/event/${id}`,{
            //     method:'POST',
            //     headers: {
            //         "Content-Type":"application/json",
            //         'X-Authorization': token
            //     },
            //     body: JSON.stringify({event_id: id, select: 0})}
            // )    
        },
        onSuccess: async (response) => {
            queryClient.invalidateQueries(['userSelectedEvents'])
            // const oldValues = queryClient.getQueryData("userSelectedEvents")
            // console.log('getQueryData',oldValues)
            // if(oldValues){
            //     console.log('SuccesRemoveEvent', oldValues)                
            //     queryClient.setQueryData("userSelectedEvents", (userSelectedEvents) => {
            //         const currentArray = userSelectedEvents['hydra:member']
            //         updater(currentArray?.filter(({id}) => (id !== params.id)))
            //     })
            setLoading(false)
            notify(`${response.message}`, {type: 'success'})
            setSuccess(true)
        },
        onError: (error) => {
            setLoading(false)
            notify(`${error}`, {type: 'error'})
        },
    })

    const handleSubmit = async () => {
        setLoading(true)
        // console.log('gotPrams',params.id)
        unSubscribeEvent(params.id)
        // console.log({cancel_button: e, params: params, email})
        // dataProvider.userSelectedBlackDragonEvents('subscribe', {id: params.id, email:email},{event_id: params.id, select: 0})
        // .then((response) => {
        //     console.log('response select DragonEvent', response)
        //     setLoading(false)
        //     notify(`${response.message}`, {type: 'success'})
        //     setSuccess(true)
        // })
        // .catch((error) => {
        //     setLoading(false)
        //     notify(`${error}`, {type: 'error'})
        // })
    }

    // useEffect(() => {
    //     params.id === rowId && alert(`If you want to cancell ${params.row.col1} \n proceed with the cancel button`)
    // }, [rowId])

    // console.log({params: params, rowId:rowId})
    return(
        <Box
            sx={{ m:1, position: 'relative' }}
        >
            {success ? (
                <Fab
                    color='warning'
                    sx={{ width:40, height: 40 }}
                    // disabled={params.row.col !== 'paid' || loading}
                    disabled={loading} // 
                >
                    <CancelOutlined />
                </Fab>
            ) : (
                <Fab
                    color='error'
                    sx={{ width:40, height: 40 }}
                    disabled={loading}
                    // disabled={params.row.status !== 'paid' || params.id !== rowId || loading}
                    // disabled={params.id !== rowId || loading}
                    onClick={handleSubmit}
                >
                    <Warning />
                </Fab>)}
            {loading && (<CircularProgress
                size={52}
                sx={{
                    color: red[500],
                    position: 'absolute',
                    top: -6,
                    left: -6,
                    zIndex: 1,
                    }}
                />)}
        </Box>
    )
  }

  export default ActionUserBlackDragonEventButton