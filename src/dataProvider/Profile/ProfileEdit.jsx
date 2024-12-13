import * as React from 'react'
import { useDataProvider, required, Edit,DateField, TextInput, TextField, ArrayInput, SimpleFormIterator, SimpleForm } from 'react-admin'
import './ProfileEdit.css'


const ProfileEdit = props => {
    const dataProvider = useDataProvider()

    const transform = (data) => {
        delete data?.subscription
        console.log("removed property subscription", data)
        return data
    };


   return <Edit resource="profiles" {...props}>
        <section id="profileEdit">
            <SimpleForm
                save={(values) => {
                    const transformedValues = transform(values)
                    dataProvider.update('profiles', { id: transformedValues.id, data: transformedValues })
                }}
            >
                <TextInput label="username" source={"username"} validate={[required()]} />
                {/* <TextInput label="websiteUrl" source={"websiteUrl"} validate={[required()]}/> */}
                <TextInput label="tokens" disabled source={"tokens"} />
                <TextInput label="userUniq" source={"userUniq"} style={{display:'none'}} />
                <TextInput label="description" source={"description"} />
                <ArrayInput source={"subscribeToEvents"} resource={"trainingsessions"}>
                    <SimpleFormIterator inline>
                        <TextField helperText={true} source={"title"} />
                        <DateField helperText={true} source={"startDate"} showTime/>
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </section>
    </Edit>
}

export default ProfileEdit