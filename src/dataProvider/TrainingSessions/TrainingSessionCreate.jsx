import { required, Create, TextInput, DateInput, BooleanInput, ReferenceInput,SimpleForm } from 'react-admin'

const TrainingSessionCreate = props => (
    <Create resource="trainingsessions" {...props}>
        <SimpleForm>
            <TextInput label="title" source={"title"} validate={[required()]} />
            <ReferenceInput label="relatedUser" source="id" reference="profiles" />
            <DateInput label="start" source={"startDate"} showTime={true} validate={[required()]}/>
            <DateInput label="end" source={"endDate"} showDate={false} showTime={true} validate={[required()]}/>
            <BooleanInput label="publish" source={"isPublished"} validate={[required()]} />
            <BooleanInput label="allday" source={"allDay"} validate={[required()]} />
        </SimpleForm>
    </Create>
)

export default TrainingSessionCreate