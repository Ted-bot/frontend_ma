import { memo, useState, useCallback, useRef, useEffect } from 'react'
import { useAuthenticated } from "react-admin"
import { 
    Card,
    Box,
    Tabs,
    Tab,
 } from "@mui/material"
 import { Title } from "react-admin"
 import { ProfileTabInterface } from './settings/ProfileTabInterface'
 import { PasswordTabInterface } from './settings/PasswordTabInterface'
 import { AddressTabInterface } from './settings/AddressTabInterface'
import { BillingTabInterface } from './settings/BillingTabInterface'
import { NotificationTabInterface } from './settings/NotificationTabInterface'
import { CustomTabPanel, a11yProps } from './settings/CustomTabPanel'
import { useTabsContext } from '../../store/tabs-context'


export const ProfileSettingsInterface = () => {
    useAuthenticated()
    
    const {state, dispatch} = useTabsContext()

    console.log('tabsNumber', state.tabNumber)
    const [value, setValue] = useState(state.tabNumber)
    const handleChange = useCallback( 
        (event, newValue) => {
          dispatch({type: 'CHANGE_TAB_NUMBER', payload: newValue})
          setValue(newValue)
    }
  )

    return (
        <>
              <Card sx={{ width:{xs: '100vw', md:'100%'} }}>
                  <Title title="Settings" />
                  <Box sx={{  borderColor: "divider"}}> {/* borderBottom: 1, */}
                      <Tabs value={value} onChange={handleChange} 
                          TabIndicatorProps={{ sx: { display: 'none' } }}
                          sx={{ '& .MuiTabs-flexContainer': {
                          flexWrap: 'wrap',
                      },  }}>
                          <Tab label="Profile" className="hover:bg-gray-500" {...a11yProps(0)}/>
                          <Tab label="Password" className="hover:bg-gray-500" {...a11yProps(1)}/>
                          <Tab label="Address" className="hover:bg-gray-500" {...a11yProps(2)}/>
                          <Tab label="Billing" className="hover:bg-gray-500" {...a11yProps(3)}/>
                          {/* <Tab label="Notifications" className="hover:bg-gray-500" {...a11yProps(4)}/> */}
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
        </>
    )
} 

export default function Counts() {
  const renderCount = useRef(0);
  return (
    <div className="mt-3">
      <p className="dark:text-white">
        Nothing has changed here but I've now rendered:{" "}
        <span className="dark:text-green-300 text-grey-900">
          {(renderCount.current ++)} time(s)
        </span>
      </p>
    </div>
  );
}
