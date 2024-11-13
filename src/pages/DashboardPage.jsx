import { useEffect } from 'react'
import { AdminGuesser,
    hydraDataProvider,
    hydraSchemaAnalyzer,
    ResourceGuesser,
} from '@api-platform/admin'
import { Layout, CustomRoutes, useAuthenticated, defaultTheme, defaultDarkTheme, defaultLightTheme} from 'react-admin'
import { Route } from 'react-router-dom'
// import { createTheme } from '@mui/material/styles'

import SignUpForm from '../components/forms/SignUpForm.jsx'
import MyMenu from '../components/navigations/DashboardNavigation.jsx'
import ProfileList from '../dataProvider/Profile/ProfileList.jsx'
import UserCreate from '../dataProvider/User/UserCreate.jsx'
import LoginDashboardLoader from '../loader/LoginDashboardLoader.jsx'

import UserProfilePage from './client/UserProfilePage'
import { dataProvider } from '../dataProvider/main/DataProvider.jsx'
import { authProvider } from '../dataProvider/main/AuthProvider.jsx'
import { ProfileSettingsInterface } from '../components/interface/UserDashboardProfileInterface'
import { SignUpLoader } from '../loader/SignUpLoader.jsx'
import CalendarPage from './CalendarPage';
import { CalendarLoader } from '../loader/CalendarLoader.jsx'
import SignUpPage from './SignUpPage.jsx'
// import MyAppBar from './DashboardLogout'
import { useTabsContext } from '../store/tabs-context.jsx'
import { NotificationTabInterface } from '../components/interface/settings/NotificationTabInterface.jsx'
import { storageNameNewUser } from "../js/util/auth"
import { getLocalStorageItem } from "../js/util/getUtil"

import indigo from '@mui/material/colors/indigo'
import pink from '@mui/material/colors/pink'
import green from '@mui/material/colors/green'
import red from '@mui/material/colors/red'
import orange from '@mui/material/colors/orange'
import { deepmerge } from '@mui/utils'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import merge from "lodash/merge"
import { light } from '@mui/material/styles/createPalette.js'
import createPalette from '@mui/material/styles/createPalette.js'
import { Typography } from '@mui/material'
import { components } from 'react-select'



const palette = createPalette(
    merge({}, defaultTheme.palette, {
      primary: {
        main: "#ff0266", // Not far from red
      },
      secondary: {
        main: "#00ba00", // Not far from green
      },
    })
  )

const typography = {
    fontFamilySecondary: "'Poppins', sans-serif",
    fontFamily: '"Comic Neue", cursive',
    fontSize: 16, // Should be a number in pixels
    fontStyle: "normal",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    color: palette.text.primary,
};


const myTheme = {
        ...defaultLightTheme,
        palette: {
            ...defaultLightTheme.palette,
            secondary: {
                main: "#E50000",
            }
        },
        components: {       
            MuiFormLabel: { //MuiFormLabel-root
                styleOverrides: { // label text input
                    root: {
                        marginTop: '10px',
                        height: '50px', 
                    },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        marginTop: '10px',
                        height: '50px',
                    },
                },
            }, //
            MuiScopedCssBaseline: {
                styleOverrides: {
                    root: {
                        background: 'transparent', 
                        '&.MuiInputBase-input': {
                            height: '50px'
                        },
                    },
                },
            }, //
            RaMenuItemLink: {
                styleOverrides: {
                    root: {
                        // invisible border when not active, to avoid position flashs
                        borderLeft: '3px solid transparent', 
                        '&.RaMenuItemLink-active': {
                            borderTopRightRadius: '80px 80px',
                            borderBottomRightRadius: '80px 80px',
                            color: 'white', 
                            background: 'linear-gradient(160deg, #E50000, #ab0926 )',
                            height: '50px'
                        },
                        '&.RaMenuItemLink-active .RaMenuItemLink-icon': {
                            color: 'white',
                        },
                        '&.RaMenuItemLink': {
                            borderRight: '15px solid #ff9958',
                        },
                        '& .RaMenuItemLink-icon': {
                            color: '#4C4C4C',
                        },
                    },
                },
            },
            MuiTableBody: {
                styleOverrides: {
                    root: { 
                        background: '#F8F8F8', //#ffd086, #C45267                        
                    }
                }
            },
            MuiCardContent: {
                styleOverrides: {
                    root: { // main content inner component
                        margin: '15px 5px 10px 10px',
                        // borderTop: '5px solid #ffd086',
                        background: '#F6E6E9',
                        boxShadow: '-2px 3px 8px 1px #ab0926',
                        borderLeft: '2px solid #E5B5BD',
                        borderTopLeftRadius: '15px 15px',
                        borderTopRightRadius: '15px 15px',
                        borderBottomLeftRadius: '15px 15px',
                        borderBottomRightRadius: '15px 15px',
                        borderBottom: '2px solid #ab0926',
                        // boxShadow: 5,
                        
                    }
                }
            },
            RaLayout: {
                styleOverrides: {
                  root: {
                    '& .RaLayout-content .css-bhp9pd-MuiPaper-root-MuiCard-root': {
                        background: 'transparent',
                        boxShadow: 'none',
                        borderRight: 'none'
                        // borderRight: '5px solid #E50000'
                    },
                    '& .MuiCardHeader-root .css-1pqodoe-MuiCardHeader-root': {
                        background: 'yellow',
                    },
                    background: 'linear-gradient(160deg, #ffd086, #C45267 )', //#ab0926
                    "& .RaLayout-contentWithSidebar": { // whole screen: content + sidebar
                    },
                    "& .RaLayout-content": { // whole screen: content + sidebar
                      background: 'linear-gradient(-20deg, #CC6B7C, #f6bf7e )',
                    },
                    "& .RaSidebar-docked": { // sideBar
                        borderLeft: '5px solid #E50000',
                      },
                    "& .RaLayout-content": { // main layout
                        background: 'transparent',
                    }
                }
            },
        }
    }
}



const myThemeDark = deepmerge(defaultDarkTheme, {palette: {mode: 'dark'}})

export default function DashboardPage() {
    useAuthenticated()
    const {state, dispatch} = useTabsContext()
    // const user = () => {
    //     const {dragonUser} = useUserIdentifier()
    //     return dragonUser
    // }
    
    const schemaAnalyzer = hydraSchemaAnalyzer()

    const MyLogin = () => (<LoginDashboardLoader />)

    const MyLayout = props => <Layout {...props} menu={MyMenu}/> //appBar={MyAppBar} 


    
    // useEffect(() => {
    //     if(!state.loggedIn){
    //         console.log('userLoggedIn',state.loggedIn)
    //         dispatch({type: 'USER_LOGGED_IN', payload: true})
    //     }
    // })

    return (
        <>
            <AdminGuesser
                defaultTheme='light'
                theme={myTheme}
                basename='/dashboard'
                dashboard={UserProfilePage}
                layout={MyLayout}
                dataProvider={dataProvider}
                schemaAnalyzer={schemaAnalyzer}
                loginPage={MyLogin}
                authProvider={authProvider}
            >
                
                <CustomRoutes>
                    <Route path="/Settings" element={<ProfileSettingsInterface />} />
                </CustomRoutes>
                <CustomRoutes>
                    <Route path="/Calendar" element={<CalendarPage/>} />
                </CustomRoutes>
                <CustomRoutes noLayout> {/* //noLayout */}
                    <Route path="/SignUp" element={<SignUpPage/>} />
                </CustomRoutes>
                <ResourceGuesser name={"users"} create={UserCreate} />
                <ResourceGuesser name={"classes"} />
                <ResourceGuesser name={"trainingsessions"} />
                <ResourceGuesser name={"profiles"} list={ProfileList} />
                <CustomRoutes>
                    <Route path="/Notifications" element={<NotificationTabInterface />} />
                </CustomRoutes>
            </AdminGuesser>            
        </>
    )
}