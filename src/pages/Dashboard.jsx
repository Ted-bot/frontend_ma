import { AdminGuesser,
    hydraDataProvider,
    hydraSchemaAnalyzer,
    ResourceGuesser,
    ListGuesser,
    FieldGuesser } from '@api-platform/admin';
import { Menu, Layout } from 'react-admin';
import LabelIcon from '@mui/icons-material/Label';


export default function Dashboard() {
// Hydra:
const dataProvider = hydraDataProvider({ entrypoint: '/api' });
const schemaAnalyzer = hydraSchemaAnalyzer();


    const UserList = props => (
        <ListGuesser {...props}>
            <FieldGuesser source={"email"} />
            <FieldGuesser source={"roles"} />
            <FieldGuesser source={"userProfile"} />
            <FieldGuesser source={"firstName"} />
            <FieldGuesser source={"lastName"} />
            <FieldGuesser source={"phoneNumber"} />
            <FieldGuesser source={"dateOfBirth"} />
            <FieldGuesser source={"gender"} />
            <FieldGuesser source={"location"} />
            <FieldGuesser source={"conversion"} />
            <FieldGuesser source={"createdAt"} />
            <FieldGuesser source={"createdAtAgo"} />
        </ListGuesser>
    )

    const MyMenu = () => (
        <Menu>
            <Menu.DashboardItem />
            <Menu.Item to="/dashboard/classes" primaryText="classes" leftIcon={<LabelIcon />} />
            <Menu.Item to="/dashboard/trainingsessions" primaryText="trainingsessions" leftIcon={<LabelIcon />} />
            <Menu.Item to="/dashboard/users" primaryText="users" leftIcon={<LabelIcon />} />
            <Menu.Item to="/dashboard/profiles" primaryText="profiles" leftIcon={<LabelIcon />} />
        </Menu>
    )

    const MyLayout = props => <Layout {...props} menu={MyMenu} />

    return (
        <>
            <AdminGuesser
                layout={MyLayout}
                dataProvider={dataProvider}
                schemaAnalyzer={schemaAnalyzer}
            />
                {/* <ResourceGuesser name={"classes"} />
                <ResourceGuesser name={"trainingsessions"} />
                <ResourceGuesser name={"users"} dataProvider={UserList} />
                <ResourceGuesser name={"profiles"} />
            </AdminGuesser> */}
            
        </>
    )
}