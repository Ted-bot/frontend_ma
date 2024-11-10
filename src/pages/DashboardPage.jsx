import { useEffect } from 'react'
import { AdminGuesser,
    hydraDataProvider,
    hydraSchemaAnalyzer,
    ResourceGuesser,
} from '@api-platform/admin'
import { Layout, CustomRoutes, useAuthenticated} from 'react-admin'
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

// export const MyAppBar = () => (
//     <AppBar>
//         <TitlePortal />
//         <MyLogoutButton />
//     </AppBar>
// )

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
                <ResourceGuesser name={"users"} create={UserCreate} />
                <ResourceGuesser name={"classes"} />
                <ResourceGuesser name={"trainingsessions"} />
                <ResourceGuesser name={"profiles"} list={ProfileList} />
            </AdminGuesser>            
        </>
    )
}