import { memo, forwardRef} from 'react'
import { 
    Card,
    Box,
    Tabs,
    Tab,
 } from "@mui/material"
 import { Title } from "react-admin"
 import { ProfileTabInterface } from '../interface/settings/ProfileTabInterface'
 import { PasswordTabInterface } from '../interface/settings/PasswordTabInterface'
 import { AddressTabInterface } from '../interface/settings/AddressTabInterface'
import { BillingTabInterface } from '../interface/settings/BillingTabInterface'
import { NotificationTabInterface } from '../interface/settings/NotificationTabInterface'
import { CustomTabPanel, a11yProps } from '../interface/settings/CustomTabPanel'


const DashboardTabsComponent = forwardRef(function DashboardTabsComponent({handleChange, value}, ref){

    
    
    return(
        <>
            <Card>
                <Title title="Settings" />
                <Box sx={{ borderBottom: 1, borderColor: "divider"}}>
                    <Tabs value={ref.current} onChange={handleChange} 
                        ref={ref}
                        TabIndicatorProps={{ sx: { display: 'none' } }}
                        sx={{ '& .MuiTabs-flexContainer': {
                        flexWrap: 'wrap',
                    },  }}>
                        <Tab label="Profile" className="hover:bg-gray-500" {...a11yProps(0)}/>
                        <Tab label="Password" className="hover:bg-gray-500" {...a11yProps(1)}/>
                        <Tab label="Address" className="hover:bg-gray-500" {...a11yProps(2)}/>
                        <Tab label="Billing" className="hover:bg-gray-500" {...a11yProps(3)}/>
                        <Tab label="Notifications" className="hover:bg-gray-500" {...a11yProps(4)}/>
                    </Tabs>
                </Box>
            </Card>
            <CustomTabPanel value={ref.current} index={0} >
                {/* ref={ref} */}
                <ProfileTabInterface />
            </CustomTabPanel>
            <CustomTabPanel value={ref.current} index={1} >
                {/* ref={ref} */}
                <PasswordTabInterface />
            </CustomTabPanel>
            <CustomTabPanel value={ref.current} index={2} >
                {/* ref={ref} */}
                <AddressTabInterface />
            </CustomTabPanel>
            <CustomTabPanel value={ref.current} index={3} >
                {/* ref={ref} */}
                <BillingTabInterface />
            </CustomTabPanel>
            <CustomTabPanel value={ref.current} index={4} >
                {/* ref={ref} */}
                <NotificationTabInterface />
            </CustomTabPanel></>
        )
    }
)


export default DashboardTabsComponent