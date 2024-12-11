import { useState, useEffect } from 'react'

import { AdminGuesser,
    hydraSchemaAnalyzer,
    ResourceGuesser,
    InputGuesser,
    CreateGuesser,
    EditGuesser,
    ShowGuesser,
    ListGuesser,
    FieldGuesser,
} from '@api-platform/admin'

import { 
    useAuthenticated, 
    Authenticated,
    Admin, 
    Layout, 
    CustomRoutes, 
    houseDarkTheme, 
    ToggleThemeButton, 
    AppBar, 
    useRefresh,
    Datagrid, 
    DateField,
    Resource, 
    Show, 
    SimpleShowLayout,
    RichTextField,
    BulkDeleteButton, 
    BulkUpdateButton, 
    defaultLightTheme, 
    SearchInput, 
    TextField, 
    TextInput,
    Filter, 
    List,
    useAuthProvider
} from 'react-admin'

import { redirect, Route, useNavigation, useNavigate } from 'react-router-dom'

import {MyMenu} from '../components/navigations/DashboardNavigation.jsx'

import ProfileList from '../dataProvider/Profile/ProfileList.jsx'
import ProfileShow from '../dataProvider/Profile/ProfileShow.jsx'

import UserCreate from '../dataProvider/User/UserCreate.jsx'
import UserList from '../dataProvider/User/UserList.jsx'
import UserEdit from '../dataProvider/User/UserEdit.jsx'
import UserShow from '../dataProvider/User/UserShow.jsx'

import TrainingSessionList from '../dataProvider/TrainingSessions/TrainingSessionList.jsx'
import TrainingSessionCreate from '../dataProvider/TrainingSessions/TrainingSessionCreate.jsx'
import TrainingSessionEdit from '../dataProvider/TrainingSessions/TrainingSessionEdit.jsx'
import TrainingSessionShow from '../dataProvider/TrainingSessions/TrainingSessionShow.jsx'

import LoginDashboardLoader from '../loader/LoginDashboardLoader.jsx'

import UserProfilePage from './client/UserProfilePage'
import { dataProvider } from '../dataProvider/main/DataProvider.jsx'
import { authProvider } from '../dataProvider/main/AuthProvider.jsx'
import { ProfileSettingsInterface } from '../components/interface/ProfileSettingsInterface'
import CalendarPage from './CalendarPage'
import SignUpPage from './SignUpPage.jsx'
import { NotificationTabInterface } from '../components/interface/settings/NotificationTabInterface.jsx'
import {PaymentPage} from './client/PaymentPage.jsx'
import inMemoryJwt from '../js/util/inMemoryJwt.js'
import { getLocalStorageItem } from '../js/util/getUtil.js'
import './Dashboard.css'
import { components } from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'

const RefreshButton = ({children}) => {
    const refresh = useRefresh()
    const handleClick = () => {
        refresh()
    }
    return <button onClick={handleClick}>{children}</button>
}

const MyAppBar = () => (
    <AppBar toolbar={<>
        <RefreshButton children={<FontAwesomeIcon className='fa-xl mr-2' icon={faRefresh}/>} />
        <ToggleThemeButton /> 
    </>}>        
    </AppBar>
)

const myDarkTheme = {
    ...houseDarkTheme,
    components: { 
        MuiScopedCssBaseline: { //MuiFormLabel-root
            styleOverrides: { // label text input
                root: {
                    color: 'black' 
                },
            },
        }
    }
    
}

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
            RaShow: {
                styleOverrides: {
                    root: {
                        color: '#ab0926',
                        margin: '15px 5px 35px 10px',
                        paddingBottom: "4rem",
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
            // MuiTableRow: {
            //     styleOverrides: {
            //         root: {
            //             borderBottom: '3px solid gray'
            //         }
            //     }
            // },
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
            MuiSvgIcon :{
                styleOverrides : {
                    fontSizeSmall: {
                        // color: 'white',
                        '&.MuiSvgIcon-root .MuiSvgIcon-fontSizeSmall .css-18ctxsx-MuiSvgIcon-root': {
                            color: 'white'
                        }
                    }
                }
            },
            MuiList : {
                styleOverrides: {
                    root: {
                        background: 'linear-gradient(160deg, #E50000, #ab0926 )', //RaMenu-open
                        color: 'white'
                    }
                }
            },
            RaMenu: {
                styleOverrides: {
                    root: {
                        background: 'transparent'
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
            MuiTooltip: {
                styleOverrides: {
                  tooltip: {
                    backgroundColor: 'E50000',
                    color: 'white',
                    border: '1px solid #dadde9',
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
            MuiTableBody: { // main resource list background
                styleOverrides: {
                    root: { 
                        background: '#e6ddcf', //#ffd086 #F8F8F8 #C45267,                         
                    }
                }
            },
            MuiPopper: { // main resource list background
                styleOverrides: {
                    root: { 
                        background: '#e6ddcf', //#ffd086 #F8F8F8 #C45267,                         
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
    // console.log({foundTOkenInDashboard: inMemoryJwt.getToken})
    const schemaAnalyzer = hydraSchemaAnalyzer()
    const MyLogin = () => (<LoginDashboardLoader />)
    const MyLayout = props => <Layout {...props} appBar={MyAppBar} menu={MyMenu}/>

    // const roles = inMemoryJwt.getRoles()
    const roles = JSON.parse(getLocalStorageItem("roles"))
    const adminRole = roles?.find(role => role === "ROLE_USER_SIFU") ?? false

    console.log({dataProvider_data: dataProvider})

    return (
        <>
            <Admin
                defaultTheme='light'
                theme={myTheme}
                darkTheme={myDarkTheme}
                basename='/dashboard'
                dashboard={UserProfilePage}
                layout={MyLayout}
                dataProvider={dataProvider}
                schemaAnalyzer={schemaAnalyzer}
                loginPage={MyLogin}
                authProvider={authProvider}
            >
                <Resource name={"users"} list={adminRole && UserList} show={adminRole && UserShow} create={adminRole && UserCreate} edit={adminRole && UserEdit} />
                <Resource name={"trainingsessions"} list={adminRole && TrainingSessionList} show={adminRole && TrainingSessionShow} create={adminRole && TrainingSessionCreate} edit={adminRole && TrainingSessionEdit}/>
                <Resource name="profiles" recordRepresentation="username" list={adminRole && ProfileList} show={adminRole && ProfileShow} /> {/*  recordRepresentation={(record) => `${record.first_name} ${record.last_name}` */}
                {/* <ResourceGuesser name={"classes"} list={adminRole && ListGuesser} show={adminRole && ShowGuesser} create={adminRole && CreateGuesser} edit={adminRole && EditGuesser} />
                <ResourceGuesser name={"trainingsessions"} list={adminRole && ListGuesser} show={adminRole && ShowGuesser} create={adminRole && CreateGuesser} edit={adminRole && EditGuesser} />
                <ResourceGuesser name={"profiles"} list={adminRole && ProfileList} show={adminRole && ShowGuesser} create={adminRole && CreateGuesser} edit={adminRole && EditGuesser} />     */}
                
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
                <CustomRoutes>
                    <Route path="/Notifications" element={<NotificationTabInterface />} />
                </CustomRoutes>
            </Admin>       
        </>
    )
}