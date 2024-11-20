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
import { ProfileSettingsInterface } from '../components/interface/ProfileSettingsInterface'
import CalendarPage from './CalendarPage'
import SignUpPage from './SignUpPage.jsx'
import { useTabsContext } from '../store/tabs-context.jsx'
import { NotificationTabInterface } from '../components/interface/settings/NotificationTabInterface.jsx'
import {PaymentPage} from './client/PaymentPage.jsx'
import { deepmerge } from '@mui/utils'
import merge from "lodash/merge"
import createPalette from '@mui/material/styles/createPalette.js'

// const palette = createPalette(
//     merge({}, defaultTheme.palette, {
//       primary: {
//         main: "#ff0266", // Not far from red
//       },
//       secondary: {
//         main: "#00ba00", // Not far from green
//       },
//     })
//   )

// const typography = {
//     fontFamilySecondary: "'Poppins', sans-serif",
//     fontFamily: '"Comic Neue", cursive',
//     fontSize: 16, // Should be a number in pixels
//     fontStyle: "normal",
//     fontWeightLight: 400,
//     fontWeightRegular: 500,
//     fontWeightMedium: 600,
//     fontWeightBold: 700,
//     color: palette.text.primary,
// }

const myTheme = {
        ...defaultLightTheme,
        palette: {
            ...defaultLightTheme.palette,
            secondary: {
                main: "#E50000",
                shadowColor: "#E50000",
            },
            common: { // remove
                white: '#E50000'
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
            MuiBox: {
                styleOverrides: {
                    root : {
                        borderBottom: 'none',
                        borderColor: 'none',
                        '&& .MuiBox-root .css-1gsv261': {
                            borderBottom: 'none',
                            borderColor: 'none',
                        }
                    }
                }
            },
            MuiPaper : {
                styleOverrides: {
                    root: {
                        background: 'transparent',
                        boxShadow: 'none',
                    }
                }
            },
            MuiTabs: {
                styleOverrides: {
                    root : {
                        background: 'linear-gradient(160deg, #E50000, #ab0926 )',
                        "&& .Mui-selected": {
                            color: 'yellow',
                            backgroundColor: "pink"
                        }
                    }
                }
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        color: 'white'
                    }
                }
            },
            MuiCard : {
                styleOverrides: {
                    root: {
                        // color: 'green',
                        '&& .MuiTypography-h5' : {
                            color: '#C45267',
                            fontWeight: 600,
                            textShadow: '-2px 1px 5px #ffd086, -2px 2px 3px #474747',
                        }
                    }
                }
            },
            MuiButtonBase : {
                styleOverrides: {
                    root: {
                        // color: 'white', // note: logout button will be effected
                        '&[aria-selected=true]' : {
                            backgroundColor: '#ff9958',
                            color: '#ffd400',
                            border:  '1px solid #757575',
                        },
                    },
                },
            },
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
            MuiList : {
                styleOverrides: {
                    root: {
                        // background: 'linear-gradient(160deg, #E50000, #ab0926 )',
                    }
                }
            },
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
            MuiMenu: {
                styleOverrides: {
                    root: {
                        color: 'black',
                        '& .css-gkufyl-MuiPaper-root-MuiPopover-paper-MuiMenu-paper' : {
                            background: '#fafafb',
                        },
                        '& .css-19zhhkc-MuiButtonBase-root-MuiMenuItem-root' : {
                            color: 'black'
                            
                        }
                    }
                }
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
                        background: '#F6E6E9',
                        boxShadow: '-2px 3px 8px 1px #ab0926',
                        borderLeft: '2px solid #E5B5BD',
                        borderTopLeftRadius: '15px 15px',
                        borderTopRightRadius: '15px 15px',
                        borderBottomLeftRadius: '15px 15px',
                        borderBottomRightRadius: '15px 15px',
                        borderBottom: '2px solid #ab0926',
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