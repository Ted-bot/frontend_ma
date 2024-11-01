import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { TabPanel } from 'react-tabs'

const CustomTabPanel = forwardRef(function CustomTabPanel(props, ref) {
    const { children, value, index, ...other } = props    
    console.log('what we got', value)
    console.log('Index we got', index)
    return (
        <TabPanel
            forceRender={value === index}
            className={`${value !== index ? '' : 'display:none'}`}
            // role="tabpanel"
            ref={ref}
            // hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            // aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </TabPanel>
    )
})

 CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

export function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  export {CustomTabPanel}