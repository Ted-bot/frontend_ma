import * as React from 'react'
import { DateField, Show, SimpleShowLayout, TextField, TextInput} from 'react-admin'

const ProfileShow = () => (
        <Show>
            <SimpleShowLayout>
                <TextField source={"id"} />
                <TextField source={"username"} />
                <TextField source={"websiteUrl"} />
                <TextField source={"tokenManagers"} />
                <TextField source={"description"} />
            </SimpleShowLayout>
        </Show>
)


export default ProfileShow