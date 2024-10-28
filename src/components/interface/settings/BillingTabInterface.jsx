import { useEffect, useState } from "react"
import { dataProvider } from "../../../dataProvider/main/DataProvider"
import { useGetIdentity } from 'react-admin'
import { useNotify } from 'react-admin'
import Box from "@mui/material/Box"
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { Fab, Typography } from "@mui/material"
import moment from "moment/moment"
import ActionUserSubscriptionButton from "../../ui/button/ActionUserSubscriptionButton"
import { grey } from '@mui/material/colors'


export const BillingTabInterface = () => {
    
    const {data: userIdentity, isPending, error} = useGetIdentity()
    const [subscriptions, setSubscriptions] = useState([])
    const notify = useNotify()
    const [rowId, setRowId] = useState(false)


    console.log({userEmail: userIdentity?.email})
    useEffect(() => {
        dataProvider.getAllSubscriptions('user_subscriptions', userIdentity?.email)
                .then((response) => {
                    console.log({loading_subscriptions: response})
                    setSubscriptions(response)
                    // notify(`Success updating Address`, { type: 'success' })
                }).catch((error) => {
                    // errorPayloadHandler(error, showErrors)
                    // const errorHandled = errorPayloadHandler(error, showErrors)
                    // if(!errorHandled) showBoundary(error)  
                    notify(`Failed loading subscriptions`, { type: 'error' })
                })
    },[])

      const columns = [
        { field: 'col1', headerName: 'Name', width: 150 },
        { field: 'col2', headerName: 'month', width: 150 },
        { field: 'col3', headerName: 'start date', width: 130},
        { field: 'col4', headerName: 'end date', width: 130 },
        { field: 'col5', headerName: 'updated', width: 130},
        { field: 'col6', headerName: 'status', width: 100 },
        { field: 'col7', headerName: 'tokens', width: 150 },
        { 
            field: 'actions', 
            headerName: 'cancell subscription', 
            type:'actions', 
            renderCell: params => <ActionUserSubscriptionButton {...{params, itemId, setItemId}} /> 
        },
      ]

      const [itemId, setItemId] = useState(null)
      

    const rows = subscriptions.map(subscription => ({
        id: subscription.id, 
        col1: subscription.subscribedProduct.name,
        col2: subscription.amount,
        col3: moment(subscription.dateStart.date).format('dd D-M-y'),
        col4: moment(subscription.dateEnd.date).format('dd D-M-y'),
        col5: moment(subscription.updatedAt.date).format('dd D-M-y'),
        col6: subscription.status,
        col7: subscription.tokenManager.tokens,
        })
    )

    const autosizeOptions = {
        includeOutliers: true,
      }


    return(
        <>
            <Box
                sx={{ height: 400, width:'100%' }}
            >
                <Typography
                    variant='h5'
                    component='h5'
                    sx={{ textAlign:'center', mt:3 , mb:3}}
                >
                    Manage subscriptions
                </Typography>

                <DataGrid 
                    rows={rows} 
                    columns={columns} 
                    getRowId={(row) => row.id }
                    // getRowHeight={() => 'auto'}
                    // autosizeOptions={autosizeOptions}
                    sx={{  
                    [`& .${gridClasses.row}`]: { 
                        bgColor: (theme) => theme.palette.mode === 'light' ? grey[200] : grey[900]
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        whiteSpace: "normal",
                        lineHeight: "normal",
                        textAlign: 'center'
                    },
                    "& .MuiDataGrid-columnHeader": {
                        // Forced to use important since overriding inline styles
                        height: "unset !important"
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        // Forced to use important since overriding inline styles
                        maxHeight: "168px !important"}
                    }}
                    onCellEditCommit={params=>setRowId(params.id)}    
                />

            </Box>
        </>
    )
}