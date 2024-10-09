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
import LoginDashboardLoader from '../loader/LoginDashboardLoader.jsx'

import UserProfilePage from './client/UserProfilePage'
import { dataProvider } from '../dataProvider/main/DataProvider.jsx'
import { authProvider } from '../dataProvider/main/AuthProvider.jsx'

export default function DashboardPage() {
    
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