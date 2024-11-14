import { AdminGuesser,
    hydraSchemaAnalyzer,
    ResourceGuesser,
} from '@api-platform/admin'
import { Layout, CustomRoutes, useAuthenticated, defaultTheme, defaultDarkTheme, defaultLightTheme} from 'react-admin'
import { Route } from 'react-router-dom'

import MyMenu from '../components/navigations/DashboardNavigation.jsx'
import ProfileList from '../dataProvider/Profile/ProfileList.jsx'
import UserCreate from '../dataProvider/User/UserCreate.jsx'
import LoginDashboardLoader from '../loader/LoginDashboardLoader.jsx'

import UserProfilePage from './client/UserProfilePage'
import { dataProvider } from '../dataProvider/main/DataProvider.jsx'
import { authProvider } from '../dataProvider/main/AuthProvider.jsx'
import { ProfileSettingsInterface } from '../components/interface/UserDashboardProfileInterface'
import CalendarPage from './CalendarPage'
import SignUpPage from './SignUpPage.jsx'
import { useTabsContext } from '../store/tabs-context.jsx'
import { NotificationTabInterface } from '../components/interface/settings/NotificationTabInterface.jsx'
import PaymentPage from './client/PaymentPage.jsx'
import { deepmerge } from '@mui/utils'
import merge from "lodash/merge"
import createPalette from '@mui/material/styles/createPalette.js'

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
}

const myTheme = {
        ...defaultLightTheme,
        palette: {
            ...defaultLightTheme.palette,
            // primary: {myText: '#E50000'},
            secondary: {
                main: "#E50000",
                shadowColor: "#E50000",
            },
            common: {
                white: '#E50000'
            }
        },
        overrides: {
            MuiGrid: {
                '& .MuiGrid-root .css-sinu4y': {
                // backgroundColor: palette.common.white,
                color: 'green',
                // height: "100%",
                boxShadow:
                "2px 0px 1px -1px rgba(0,0,0,0.2), 1px 0px 3px 0px rgba(0,0,0,0.1)",}
            },
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
                        color: '#ab0926',
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
            // MuiBox: {
            //     styleOverrides: {
            //         root: {
            //             boxShadow: '5px 5px 5px blue',
            //             color: 'green',
            //             '&.MuiBox-root .css-18uuk9m' : {
            //                 boxShadow: '5px 5px 5px blue'
            //             }
            //         }
            //     }
            // },
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


export default function DashboardPage() {
    useAuthenticated()
    
    const schemaAnalyzer = hydraSchemaAnalyzer()
    const MyLogin = () => (<LoginDashboardLoader />)
    const MyLayout = props => <Layout {...props} menu={MyMenu}/> //appBar={MyAppBar} 

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
                <CustomRoutes noLayout> {/* //noLayout */}
                    <Route path="/payment" element={<PaymentPage/>} />
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