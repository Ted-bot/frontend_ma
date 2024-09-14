import { AdminGuesser,
    hydraDataProvider,
    hydraSchemaAnalyzer,
    ResourceGuesser,
} from '@api-platform/admin'
import { Layout, CustomRoutes } from 'react-admin'
import { Route } from 'react-router-dom'
// import { createTheme } from '@mui/material/styles'

import SignUpForm from '../components/forms/SignUpForm.jsx'
import MyMenu from '../components/navigations/DashboardNavigation.jsx'
import ProfileList from '../dataProvider/Profile/ProfileList.jsx'
import UserCreate from '../dataProvider/User/UserCreate.jsx'
import LoginDashboardLoader from '../components/loader/LoginDashboardLoader.jsx'
import { ApiFetch, ApiFetchPostOptions } from '../js/util/postUtil.js'

import { getLocalStorageItem} from "../js/util/getUtil.js"
import { getAuthToken, deleteAuthToken } from '../js/util/auth.js'

import { PostError } from '../js/error/PostError.js'

import UsersDashboardPage from './client/UsersDashboardPage'

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

    const dataProvider = hydraDataProvider({ entrypoint: '/api' })
    const schemaAnalyzer = hydraSchemaAnalyzer()
    const itemLocalstorage = 'user'

    const MyLogin = () => (
            <LoginDashboardLoader />
    )

    const authProvider = {
        login: async ({ email, password }) => {
            
            const apiOptions = {url: '/api/login_check', method: 'POST'}
            const prepareQueryObj = ApiFetchPostOptions(apiOptions,{ username: email, password })
            const authenticateClient = await ApiFetch(prepareQueryObj)
            
            if(!authenticateClient.ok)
            {
                console.log({redirect: 'failed!'})
                const response = await authenticateClient.json()
                throw new PostError('Api Login error', response)  
            }

            console.log({loggedIn: authenticateClient})
            
            return Promise.resolve(authenticateClient)           

        },
        logout: () => {
            deleteAuthToken()
            // localStorage.removeItem('email');
            return Promise.resolve()
        },
        checkAuth: () =>
                getAuthToken() != null ? Promise.resolve() : Promise.reject(),
            // localStorage.getItem('email') ? Promise.resolve() : Promise.reject(),
        checkError:  (error) => {
            const status = error.status;
            if (status === 401 || status === 403) {
                deleteAuthToken()
                // localStorage.removeItem('email');
                return Promise.reject();
            }
            // other error code (404, 500, etc): no need to log out
            return Promise.resolve();
        },
        getIdentity: () => {
            const userData = getLocalStorageItem(itemLocalstorage)

            return Promise.resolve({
                id: userData?.id,
                fullName: userData?.firstName + ' ' + userData?.lastName,
            })},
        getPermissions: () => Promise.resolve(),
    }    

    const MyLayout = props => <Layout {...props} menu={MyMenu} />

    return (
        <>
            <AdminGuesser
                basename='/dashboard'
                dashboard={UsersDashboardPage}
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