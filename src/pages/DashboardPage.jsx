import { AdminGuesser,
    hydraDataProvider,
    hydraSchemaAnalyzer,
    ResourceGuesser,
} from '@api-platform/admin'
import { Layout, CustomRoutes} from 'react-admin'
import { Route } from 'react-router-dom'
// import { createTheme } from '@mui/material/styles'

import SignUpForm from '../components/forms/SignUpForm.jsx'
import MyMenu from '../components/navigations/DashboardNavigation.jsx'
import ProfileList from '../dataProvider/Profile/ProfileList.jsx'
import UserCreate from '../dataProvider/User/UserCreate.jsx'
import LoginDashboardLoader from '../components/loader/LoginDashboardLoader.jsx'
import { ApiFetch, ApiFetchPostOptions } from '../js/util/postUtil.js'

import { getLocalStorageItem} from "../js/util/getUtil.js"
import { setAuthToken,getAuthToken, deleteAuthToken } from '../js/util/auth.js'

import { PostError } from '../js/error/PostError.js'

import UserProfilePage from './client/UserProfilePage'
import { dataProvider } from '../dataProvider/main/DataProvider.jsx'
import { authProvider } from '../dataProvider/main/AuthProvider.jsx'

export default function DashboardPage() {

    // const theme = createTheme({
    //     breakpoints: {
    //         values: {
    //           mobile: 0,
    //           tablet: 640,
    //           laptop: 1024,
    //           desktop: 1200,
    //         },
    //         palette: {
    //             primary: {
    //                 main: purple[500],
    //             },
    //             secondary: {
    //                 main: green[500],
    //             },
    //         },
    //     }
    // })
    
    const schemaAnalyzer = hydraSchemaAnalyzer()
    const itemLocalstorage = 'user'

    const MyLogin = () => (
            <LoginDashboardLoader />
    )

    const MyLayout = props => <Layout {...props} menu={MyMenu} />

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
                <CustomRoutes noLayout >
                    <Route path="/register" element={<SignUpForm />} />
                </CustomRoutes>
                <ResourceGuesser name={"users"} create={UserCreate} />
                <ResourceGuesser name={"classes"} />
                <ResourceGuesser name={"trainingsessions"} />
                <ResourceGuesser name={"profiles"} list={ProfileList} />
            </AdminGuesser>            
        </>
    )
}