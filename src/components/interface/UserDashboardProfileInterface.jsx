import { useState } from 'react'
import PropTypes from 'prop-types'
import { 
    Card,
    Box,
    Tabs,
    Tab,
    TextField,
 } from "@mui/material"
 import { useAuthenticated, Title } from "react-admin"

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

    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
      }
    return (
        <>
            <Card>
                <Title title="Settings" />
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Profile" className="hover:bg-gray-500" {...a11yProps(0)}/>
                        <Tab label="Password" className="hover:bg-gray-500" {...a11yProps(0)}/>
                        <Tab label="Billing" className="hover:bg-gray-500" {...a11yProps(0)}/>
                        <Tab label="Notifications" className="hover:bg-gray-500" {...a11yProps(0)}/>
                    </Tabs>
                </Box>
            </Card>
            <CustomTabPanel value={value} index={0}>
                Item One
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Item Three
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                Item Four
            </CustomTabPanel>
        </>
    )
} 