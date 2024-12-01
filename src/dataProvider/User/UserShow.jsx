import * as React from 'react'
import { DateField, Show, SimpleShowLayout, TextField, TextInput} from 'react-admin'

const UserShow = () => (
        <Show>
            <SimpleShowLayout>
                <TextField source={"firstName"} />
                <TextField source={"lastName"} />
                <TextField source={"email"} />
                <TextField source={"roles"} />
                <TextField source={"location"} />
                <TextField source={"phoneNumber"} />
                <TextField source={"dateOfBirth"} />
                <TextField source={"gender"} />
                <TextField source={"userProfile"} />
                <TextField source="conversion" />
                <DateField label="created" source="createdAt" />
            </SimpleShowLayout>
        </Show>
)


export default UserShow