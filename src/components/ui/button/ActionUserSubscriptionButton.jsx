import { useState, useEffect } from "react"
import { Box, Fab, CircularProgress } from '@mui/material'
import { red } from '@mui/material/colors'
import { CancelOutlined, Warning } from '@mui/icons-material'
import { dataProvider } from "../../../dataProvider/main/DataProvider"
import { useNotify } from "react-admin"

const ActionUserSubscriptionButton = ({params, rowId, setRowId}) => {
    const notify = useNotify()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const handleSubmit = async (e) => {
        setLoading(true)
        console.log({cancel_button: e, params: params})
        dataProvider.cancelSubscription('cancel_user_subscription', params.email, {uuid: params.row.uuid, name: params.row.name})
        .then(() => {
            setLoading(false)
            notify(`You have Cancelled your subscription`, {type: 'success'})
            setSuccess(true)

        })
        .catch(() => {
            setLoading(false)
            notify(`Currently we could not cancell your subscription, please try again at a later moment`, {type: 'error'})
        })
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
                    disabled={params.id !== rowId || loading} // 
                >
                    <CancelOutlined />
                </Fab>
            ) : (
                <Fab
                    color='error'
                    sx={{ width:40, height: 40 }}
                    disabled={params.row.status !== 'paid' || params.id !== rowId || loading}
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

  export default ActionUserSubscriptionButton