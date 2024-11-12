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
import MyLogoutButton from '../components/ui/button/LogoutButton.jsx'
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
            primary: {
                // light: orange[400],
                main: green[500],
            },
            secondary: {
                main: "#fd5335",
                // main: orange[900/1],
                // light: indigo[600]
            }
        },
        components: {       
            MuiFormLabel: { //MuiFormLabel-root
                styleOverrides: { // label text input
                    root: {
                        // invisible border when not active, to avoid position flashs
                        marginTop: '10px',
                        height: '50px', 
                        // '&.MuiInputBase-input': {
                        //     // borderLeft: '15px solid #ff9958',
                        //     height: '50px'
                        // },
                    },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        // invisible border when not active, to avoid position flashs
                        marginTop: '10px',
                        height: '50px', 
                        // '&.MuiInputBase-input': {
                        //     // borderLeft: '15px solid #ff9958',
                        //     height: '50px'
                        // },
                    },
                },
            }, //
            MuiScopedCssBaseline: {
                styleOverrides: {
                    root: {
                        // invisible border when not active, to avoid position flashs
                        background: 'transparent', 
                        '&.MuiInputBase-input': {
                            // borderLeft: '15px solid #ff9958',
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
                            borderLeft: '15px solid #ff9958',
                            height: '50px'
                        },
                        // borderRight: '3px solid #ffd086', 
                        '&.RaMenuItemLink': {
                            borderRight: '15px solid #ff9958',
                            // height: '50px'
                        },
                        '& .RaMenuItemLink-icon': {
                            color: '#4C4C4C',
                            // color: '#ff9958',
                        },
                    },
                },
           },
            MuiCardContent: {
                styleOverrides: {
                    root: { // main content inner component
                        // backgroundColor: orange[300],
                        borderTop: '5px solid #ffd086',
                        "& .MuiCardContent-root": { // sideBar
                            backgroundColor: indigo[500],
                            // border: '5px solid green',
                            // border: '5px solid blue',
                            borderColor: indigo[400]
                    },
                }
                }
            },
            RaLayout: {
                styleOverrides: {
                  root: {
                    background: 'linear-gradient(160deg, #ffd086, #ab0926 )',
                    "& .RaLayout-contentWithSidebar": { // whole screen: content + sidebar
                    //   border: '15px solid #ff9958',
                    //   borderColor: indigo[400]
                    },
                    "& .RaSidebar-docked": { // sideBar
                        // backgroundColor: indigo[500],
                        borderLeft: '5px solid #ff9958',
                        // borderRight: '5px solid #ff9958',
                        borderTop: '5px solid #ff9958',
                        // borderColor: indigo[400]
                      },
                    "& .RaLayout-content": { // main layout
                        // borderLeft: 'solid 5px #ffd086',
                        background: 'linear-gradient(-20deg, #CC6B7C, #f6bf7e )'
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
                darkTheme={null}
                theme={myTheme}
                lightTheme={null}
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
                    <Route path="/SignUp" element={<SignUpForm storageNameNewUser={storageNameNewUser} userStoredFormData={getLocalStorageItem(storageNameNewUser)}/>} />
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