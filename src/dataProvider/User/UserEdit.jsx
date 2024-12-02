import * as React from 'react'
import { useNotify, useRefresh, useRedirect,  } from 'react-admin'
import { required, Edit, PasswordInput,TextInput, SimpleForm, ArrayInput, SimpleFormIterator } from 'react-admin'
import './UserEdit.css'

const UserEdit = props => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onError = (error) => {
        notify(`Could not edit post: ${error.message}`, {type: 'error'})
        redirect('/dashboard/users')
        refresh()
    }

    return (
        <Edit resource="users" mutationOptions={{ onError }} {...props}>
            <section id="edit-page">
            <SimpleForm>

                
                <TextInput source={"firstName"} validate={[required()]} fullWidth />
                <TextInput source={"lastName"} validate={[required()]} fullWidth />
                <TextInput source={"email"} validate={[required()]} fullWidth />
                <ArrayInput source={"roles"} >
                    <SimpleFormIterator inline>
                        <TextInput helperText={true} />
                    </SimpleFormIterator>
                </ArrayInput>
                {/* <TextInput source={"roles"} validate={[required()]} fullWidth /> */}
                <PasswordInput source={"password"} fullWidth />
                <TextInput source={"phoneNumber"} validate={[required()]} fullWidth />
                <TextInput source={"dateOfBirth"} validate={[required()]} fullWidth />
                <TextInput source={"gender"} validate={[required()]} fullWidth />
                <TextInput source={"location"} validate={[required()]} fullWidth />
                <TextInput source={"subscriptions"}fullWidth />
                <TextInput source={"shopOrders"} disabled fullWidth />
                <TextInput source={"userAddresses"} disabled fullWidth />
                <TextInput multiline source={"conversion"} validate={[required()]} fullWidth />
            </SimpleForm>
            </section>
        </Edit>
    )
}

export default UserEdit