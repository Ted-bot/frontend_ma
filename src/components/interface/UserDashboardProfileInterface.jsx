import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { 
    Card,
    Box,
    Tabs,
    Tab,
    TextField,
 } from "@mui/material"
 import { useAuthenticated, Title } from "react-admin"
 import { ProfileTabInterface } from './settings/ProfileTabInterface'
 import { PasswordTabInterface } from './settings/PasswordTabInterface'
 import { AddressTabInterface } from './settings/AddressTabInterface'
// import { getStates, inputBlurHandle } from '../class/userData/FormHelper.jsx'
import { GetState } from 'react-country-state-city/dist/cjs'
import { countryid } from '../../js/util/auth'
import { getStates } from '../class/userData/FormHelper'
import Notification from '../ui/notification/Notification'
import { useSelector, useDispatch } from 'react-redux'
import { userActions } from '../../store/features/users/userSlice'

let isInitail = true

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props    

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

export const ProfileSettingsInterface = () => {
    useAuthenticated()
    const reduxDispatch = useDispatch()

    const [value, setValue] = useState(0)
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const notification = useSelector((state) => state.users.ui.notification)

    useEffect(() => {
        if(notification){
            setTimeout(()=> {
                reduxDispatch(userActions.showNotification(null))
            }, 7000)
        }
    }, [notification])
    
    
    return (
        <>
            <Card>
                <Title title="Settings" />
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Profile" className="hover:bg-gray-500" {...a11yProps(0)}/>
                        <Tab label="Password" className="hover:bg-gray-500" {...a11yProps(0)}/>
                        <Tab label="Address" className="hover:bg-gray-500" {...a11yProps(0)}/>
                        <Tab label="Billing" className="hover:bg-gray-500" {...a11yProps(0)}/>
                        <Tab label="Notifications" className="hover:bg-gray-500" {...a11yProps(0)}/>
                    </Tabs>
                </Box>
            </Card>
            <CustomTabPanel value={value} index={0}>
                {notification && <Notification status={notification.status} title={notification.title} message={notification.message} />}
                <ProfileTabInterface />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                {notification && <Notification status={notification.status} title={notification.title} message={notification.message} />}
                <PasswordTabInterface />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                {notification && <Notification status={notification.status} title={notification.title} message={notification.message} />}
                <AddressTabInterface />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                {notification && <Notification status={notification.status} title={notification.title} message={notification.message} />}
                Item Four
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
                {notification && <Notification status={notification.status} title={notification.title} message={notification.message} />}
                Item Five
            </CustomTabPanel>
        </>
    )
} 