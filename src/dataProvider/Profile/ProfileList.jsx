import { 
    ListGuesser,
    FieldGuesser 
} from '@api-platform/admin'
import { List, Datagrid, TextField, DateField } from 'react-admin'


const ProfileList = () => (
    <List
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