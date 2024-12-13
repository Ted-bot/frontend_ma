import { required, Create, TextInput, SimpleForm } from 'react-admin'

const TrainingSessionCreate = props => (
    <Create resource="trainingsessions" {...props}>
        <SimpleForm>
            <TextInput label="username" source={"username"} validate={[required()]} />
            {/* <TextInput label="websiteUrl" source={"websiteUrl"} validate={[required()]}/> */}
            <TextInput label="tokenManagers" source={"tokenManagers"} validate={[required()]} />
            <TextInput label="description" source={"description"} validate={[required()]} />
        </SimpleForm>
    </Create>
)

export default TrainingSessionCreate