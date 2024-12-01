import { List, Datagrid, TextField, DateField } from 'react-admin'
import UserFilters from './UserFilters'

const UserList = () => (
    <List filters={UserFilters}>
        <Datagrid
            rowClick="show"
        >
            <TextField source={"firstName"} />
            <TextField source={"lastName"} />
            <TextField source={"email"} />
            <TextField source={"roles"} />
            <TextField source={"location"} />
            <TextField source="conversion" />
            <TextField source={"phoneNumber"} />
            <TextField source={"dateOfBirth"} />
            <TextField source={"gender"} />
            <TextField source={"userProfile"} />
        </Datagrid>
    </List>
)

export default UserList