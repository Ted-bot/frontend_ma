import { useEffect, useState } from "react"
import { dataProvider } from "../../../dataProvider/main/DataProvider"
import { useGetIdentity } from 'react-admin'
import { useNotify } from 'react-admin'
import Box from "@mui/material/Box"
import { DataGrid, gridClasses,useGridApiEventHandler} from '@mui/x-data-grid'
import { Fab, Typography } from "@mui/material"
import moment from "moment/moment"
import ActionUserBlackDragonEventButton from "../../ui/button/ActionUserBlackDragonEventButton"
import { grey } from '@mui/material/colors'
import { useUserSelectedEvents } from "../../../hooks/query/usePublisedEvents"


export const NotificationTabInterface = () => {
    
    const {data: userIdentity, isPending, error} = useGetIdentity()
    const eventsData = useUserSelectedEvents(userIdentity?.email)
    // const {eventsData, status} = useUserSelectedEvents(userIdentity?.email)
    const [registeredEvents, setRegisteredEvents] = useState([])
    const notify = useNotify()
    const [rowId, setRowId] = useState(false)
    const [pageSize, setPageSize] = useState(5)

    console.log('test',eventsData?.events)

    useEffect(() => {        
        if(eventsData?.events['hydra:member'] != 'No Subscribed Events Available') setRegisteredEvents(eventsData?.events['hydra:member'])
    },[eventsData?.events, registeredEvents])

    const columns = [
        { field: 'title', headerName: 'Event', flex: 2 },
        { field: 'day', headerName: 'start date', minWidth: 110},
        { field: 'start', headerName: 'start time', flex: 1, align: 'center'},
        { field: 'end', headerName: 'end time', flex:1, align: 'center'},
        { 
            field: 'actions', 
            headerName: 'cancell event', 
            type:'actions', 
            renderCell: params => <ActionUserBlackDragonEventButton {...{params, email: userIdentity?.email, updater: setRegisteredEvents}} /> 
        },
    ]      

    console.log('registeredEvents', registeredEvents)
    const rows = registeredEvents?.map(registeredEvent => ({
        id: registeredEvent.id, 
        title: registeredEvent.title,
        day: moment(registeredEvent.start).format('dd D-MM-YY'),
        start: moment(registeredEvent.start).format('hh:mm'),
        end: moment(registeredEvent.end).format('hh:mm'),
        })
    )

    // const autosizeOptions = {
    //     includeOutliers: true,
    //   }

   console.log("registeredEvents ",registeredEvents)

    if(registeredEvents?.status === 'loading') return <p>Loading ...</p>
    if(!rows) return <p>Loading ...</p>
    if(registeredEvents?.status === 'error' || registeredEvents?.status === 'failed') notify(`Failed loading events`, { type: 'error' })

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

                {rows ? <DataGrid 
                    rows={rows} 
                    columns={columns} 
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
            : <p>No Notifications set</p>}

            </Box>
        </>
    )
}