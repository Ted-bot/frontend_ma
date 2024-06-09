import { AdminGuesser,
    hydraDataProvider,
    hydraSchemaAnalyzer,
    ResourceGuesser,
} from '@api-platform/admin'
import { Layout } from 'react-admin'
import MyMenu from '../components/navigations/DashboardNavigation.jsx'
import ProfileList from '../dataProvider/Profile/ProfileList.jsx'
import UserCreate from '../dataProvider/User/UserCreate.jsx'
import MyLoginForm from '../components/forms/dashboardLogin.jsx'
import { ApiFetch,
     ApiFetchPostOptions,
    //  ApiFetchGetOptions,
    // setLocalStorageItem,
    deleteToken, 
    getToken,
    getLocalStorageItem
} from '../js/util/postUtil.js'
import { PostError } from '../js/error/PostError.js'

import UsersDashboardPage from './admin/UsersDashboardPage'

export default function DashboardPage() {

    const dataProvider = hydraDataProvider({ entrypoint: '/api' })
    const schemaAnalyzer = hydraSchemaAnalyzer()
    const itemLocalstorage = 'user'

    const MyLogin = () => (
            <MyLoginForm />
    )

    const authProvider = {
        login: async ({ email, password }) => {
            
            const apiOptions = {url: '/api/v1/login', method: 'POST'}
            const prepareQuery = ApiFetchPostOptions(apiOptions,{ email, password })
            const authenticatClient = await ApiFetch(prepareQuery)
            
            if(!authenticatClient.ok)
            {
                console.log({redirect: 'failed!'})
                const response = await authenticatClient.json()
                throw new PostError('Api Login error', response)  
            }

            return Promise.resolve(authenticatClient)           

        },
        logout: () => {
            deleteToken()
            // localStorage.removeItem('email');
            return Promise.resolve()
        },
        checkAuth: () =>
                getToken() != null ? Promise.resolve() : Promise.reject(),
            // localStorage.getItem('email') ? Promise.resolve() : Promise.reject(),
        checkError:  (error) => {
            const status = error.status;
            if (status === 401 || status === 403) {
                deleteToken()
                // localStorage.removeItem('email');
                return Promise.reject();
            }
            // other error code (404, 500, etc): no need to log out
            return Promise.resolve();
        },
        getIdentity: () => {
            const userData = getLocalStorageItem(itemLocalstorage)
            return Promise.resolve({
                id: userData.id,
                fullName: userData.name,
            })},
        getPermissions: () => Promise.resolve(''),
    }    

    const MyLayout = props => <Layout {...props} menu={MyMenu} />

    // console.log({user: UserName})
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
                <ResourceGuesser name={"users"} create={UserCreate} />
                <ResourceGuesser name={"classes"} />
                <ResourceGuesser name={"trainingsessions"} />
                <ResourceGuesser name={"profiles"} list={ProfileList} />
            </AdminGuesser>            
        </>
    )
}