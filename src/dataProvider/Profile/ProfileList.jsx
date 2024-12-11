import { 
    ListGuesser,
    FieldGuesser 
} from '@api-platform/admin'
import { List, Datagrid, TextField, DateField, Pagination } from 'react-admin'

const ProfilePagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />

const ProfileList = () => (
    <List
        pagination={<ProfilePagination/>}
    //  filters={UserFilters}
    >
        <Datagrid rowClick="show" >
            <TextField source={"id"} />
            <TextField source={"username"} />
            <TextField source={"websiteUrl"} />
            <TextField source={"tokenManagers"} />
            <TextField source={"description"} />
        </Datagrid>
    </List>
)

export default ProfileList