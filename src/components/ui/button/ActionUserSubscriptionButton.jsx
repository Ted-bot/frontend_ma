import { useState } from "react"
import { Box } from "@mui/material"
import {Fab} from "@mui/material"
import { CircularProgress } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CancelOutlined, Warning } from '@mui/icons-material'
// import {Check} from '@mui/material'
const ActionUserSubscriptionButton = ({params, rowId, setRowId}) => {
      const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const handleSubmit = async () => {

    }
    return(
        <Box
            sx={{ m:1, position: 'relative' }}
        >
            {success ? (
                <Fab
                    color='primary'
                    sx={{ width:40, height: 40 }}
                    disabled={params.id !== rowId || loading}
                >
                    <CancelOutlined />
                </Fab>
            ) : (
                <Fab
                    color='primary'
                    sx={{ width:40, height: 40 }}
                    disabled={params.id !== rowId || loading}
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