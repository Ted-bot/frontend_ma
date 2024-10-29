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
import { BillingTabInterface } from './settings/BillingTabInterface'
import { NotificationTabInterface } from './settings/NotificationTabInterface'

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
    // const reduxDispatch = useDispatch()

    const [value, setValue] = useState(0)
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }


    return (
        <>
            <Card>
                <Title title="Settings" />
                <Box sx={{ borderBottom: 1, borderColor: "divider"}}>
                    <Tabs value={value} onChange={handleChange} 
                        TabIndicatorProps={{ sx: { display: 'none' } }}
                        sx={{ '& .MuiTabs-flexContainer': {
                        flexWrap: 'wrap',
                    },  }}>
                        <Tab label="Profile" className="hover:bg-gray-500" {...a11yProps(0)}/>
                        <Tab label="Password" className="hover:bg-gray-500" {...a11yProps(0)}/>
                        <Tab label="Address" className="hover:bg-gray-500" {...a11yProps(0)}/>
                        <Tab label="Billing" className="hover:bg-gray-500" {...a11yProps(0)}/>
                        <Tab label="Notifications" className="hover:bg-gray-500" {...a11yProps(0)}/>
                    </Tabs>
                </Box>
            </Card>
            <CustomTabPanel value={value} index={0}>
                <ProfileTabInterface />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <PasswordTabInterface />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <AddressTabInterface />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <BillingTabInterface />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
                <NotificationTabInterface />
            </CustomTabPanel>
        </>
    )
} 