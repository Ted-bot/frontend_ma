import { useEffect, useState } from "react"
import { dataProvider } from "../../../dataProvider/main/DataProvider"
import { useGetIdentity } from 'react-admin'
import { useNotify } from 'react-admin'
import Box from "@mui/material/Box"
import { DataGrid, gridClasses,useGridApiEventHandler,
    useGridApiRef } from '@mui/x-data-grid'
import { Fab, Typography } from "@mui/material"
import moment from "moment/moment"
import ActionUserSubscriptionButton from "../../ui/button/ActionUserSubscriptionButton"
import { grey } from '@mui/material/colors'


export const BillingTabInterface = () => {
    
    const {data: userIdentity, isPending, error} = useGetIdentity()
    const [subscriptions, setSubscriptions] = useState([])
    const notify = useNotify()
    const [rowId, setRowId] = useState(false)
    const apiRef = useGridApiRef()
   
    console.log({userEmail: userIdentity?.email})
    useEffect(() => {
        dataProvider.getAllSubscriptions('user_subscriptions', userIdentity?.email)
                .then((response) => {
                    console.log({loading_subscriptions: response})
                    setSubscriptions(response)
                }).catch((error) => {
                    notify(`Failed loading subscriptions`, { type: 'error' })
                })
    },[])

    useEffect(() => {
        const handleRowClick = (params) => {
            alert(`If you want to cancell ${params.row.name} \n proceed with the cancel button`)
        }
    
        // The `subscribeEvent` method will automatically unsubscribe in the cleanup function of the `useEffect`.
        return apiRef.current.subscribeEvent('rowClick', handleRowClick)
      }, [apiRef])

    const columns = [
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'amount', headerName: 'month', width: 150 },
        { field: 'start', headerName: 'start date', width: 130},
        { field: 'end', headerName: 'end date', width: 130 },
        { field: 'updated', headerName: 'updated', width: 130},
        { field: 'status', headerName: 'status', width: 100 },
        { field: 'tokens', headerName: 'tokens', width: 150 },
        { field: 'uuid', headerName: 'uuid', width: 150 },
        { 
            field: 'actions', 
            headerName: 'cancell subscription', 
            type:'actions', 
            renderCell: params => <ActionUserSubscriptionButton {...{params, rowId, setRowId}} /> 
        },
    ]

    //   const [itemId, setItemId] = useState(null)
    const [pageSize, setPageSize] = useState(5)
      

    const rows = subscriptions.map(subscription => ({
        id: subscription.id, 
        name: subscription.subscribedProduct.name,
        amount: subscription.amount,
        start: moment(subscription.dateStart.date).format('dd D-M-y'),
        end: moment(subscription.dateEnd.date).format('dd D-M-y'),
        updated: moment(subscription.updatedAt.date).format('dd D-M-y'),
        status: subscription.status,
        tokens: subscription.tokenManager.tokens,
        uuid: subscription.uuid,
        })
    )

    // const autosizeOptions = {
    //     includeOutliers: true,
    //   }

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
                    apiRef={apiRef} 
                    getRowId={(row) => row.id }
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                              // Hide columns status and traderName, the other columns will remain visible
                              uuid: false,
                            },
                        },
                        pagination: { paginationModel: { pageSize: 5 } },
                      }}
                    pageSize={pageSize}
                    rowsPerPageOptions={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
                    onRowClick={params=> setRowId(params.id)}    
                />

            </Box>
        </>
    )
}