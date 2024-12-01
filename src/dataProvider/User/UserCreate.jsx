import { required, Create, TextInput, SimpleForm } from 'react-admin'

const UserCreate = props => (
    <Create resource="users" {...props}>
        <SimpleForm>
            <TextInput source={"firstName"} validate={[required()]} fullWidth />
            <TextInput source={"lastName"} validate={[required()]} fullWidth />
            <TextInput source={"email"} validate={[required()]} fullWidth />
            <TextInput source={"password"} validate={[required()]} fullWidth />
            <TextInput source={"phoneNumber"} validate={[required()]} fullWidth />
            <TextInput source={"dateOfBirth"} validate={[required()]} fullWidth />
            <TextInput source={"gender"} validate={[required()]} fullWidth />
            <TextInput source={"location"} validate={[required()]} fullWidth />
            <TextInput multiline source={"conversion"} validate={[required()]} fullWidth />
        </SimpleForm>
    </Create>
)

export default UserCreate