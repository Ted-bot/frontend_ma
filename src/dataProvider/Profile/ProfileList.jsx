import { List, Datagrid, TextField, Pagination } from 'react-admin'
import ProfileFilters from './ProfileFilters'

const ProfilePagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />

const ProfileList = () => (
    <List
        pagination={<ProfilePagination/>}
        filters={ProfileFilters}
    >
        <Datagrid rowClick="show" >
            <TextField source={"id"} />
            <TextField source={"username"} />
            {/* <TextField source={"websiteUrl"} /> */}
            <TextField label="token" source={"tokens"} />
            <TextField source={"description"} />
        </Datagrid>
    </List>
)

export default ProfileList