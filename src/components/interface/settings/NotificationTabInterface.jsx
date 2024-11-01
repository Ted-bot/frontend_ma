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


export const NotificationTabInterface = () => {
    
    const {data: userIdentity, isPending, error} = useGetIdentity()
    const [registeredEvents, setRegisteredEvents] = useState([])
    const notify = useNotify()
    const [rowId, setRowId] = useState(false)
    const [pageSize, setPageSize] = useState(5)
    const apiRef = useGridApiRef()
   
    console.log({userEmail: userIdentity?.email})
    useEffect(() => {
        dataProvider.getUserRegisteredEvents('registered_events', userIdentity?.email)
                .then((response) => {
                    console.log({loading_registeredEvents: response})
                    setRegisteredEvents(response['hydra:member'])
                    // notify(`Succes loading events`, { type: 'success' })
                }).catch((error) => {
                    notify(`Failed loading events`, { type: 'error' })
                })
    },[])

    useEffect(() => {
        const handleRowClick = (params) => {
            // if(params.row.status !== 'paid') return
            // alert(`If you want to cancell ${params.row.title} \n proceed with the cancel button`)
        }
    
        // The `subscribeEvent` method will automatically unsubscribe in the cleanup function of the `useEffect`.
        return apiRef.current.subscribeEvent('rowClick', handleRowClick)
      }, [apiRef])

    const columns = [
        // { field: 'id', headerName: 'ID', ,
        { field: 'title', headerName: 'Event', resizable: true, flex: 2 },
        { field: 'day', headerName: 'start date', resizable: true, minWidth: 110},
        { field: 'start', headerName: 'end date', resizable: true, flex: 1, align: 'center'},
        { field: 'end', headerName: 'end date', resizable: true, flex:1, align: 'center'},
        { 
            field: 'actions', 
            headerName: 'cancell event', 
            type:'actions', 
            renderCell: params => <ActionUserSubscriptionButton {...{params, rowId, setRowId}} /> 
        },
    ]      

    const rows = registeredEvents.map(registeredEvent => ({
        id: registeredEvent.id, 
        title: registeredEvent.title,
        day: moment(registeredEvent.start).format('dd D-M-YY'),
        start: moment(registeredEvent.start).format('H:M'),
        end: moment(registeredEvent.end).format('H:M'),
        })
    )

    // const autosizeOptions = {
    //     includeOutliers: true,
    //   }
    console.log('registeredEvents', registeredEvents)
    return(
        <>
            <Box sx={{ height: 400, width:{ xs:'85vw', md:'100%'} }} >
                <Typography
                    variant='h5'
                    component='h5'
                    sx={{ textAlign:'center', mt:3 , mb:3}}
                >
                    Manage registeredEvents
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
                            //   uuid: false,
                            },
                        },
                        pagination: { paginationModel: { pageSize: 5 } },
                      }}
                    pageSize={pageSize}
                    pageSizeOptions={[5]}
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