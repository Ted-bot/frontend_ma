import * as React from 'react'
import { useDataProvider, required, Edit,TextInput, Datagrid, TextField, EditButton, ReferenceManyField, AutocompleteInput,SelectInput, DateTimeInput, ArrayInput, SimpleFormIterator, BooleanInput, ReferenceInput,SimpleForm } from 'react-admin'
import './TrainingSessionEdit.css'
import { getLocalStorageItem } from '../../js/util/getUtil'
import { reformatEditTimeUnit } from '../../js/util/dateUtil'
import moment from 'moment-timezone'

const transformToLocalTimezone = (date, timezone = 'Europe/Amsterdam') =>
    moment.utc(date).format('YYYY-MM-DDTHH:mm:ss')

const filterToQuery = searchText => ({ username: `%${searchText}%` })

const resourceList = getLocalStorageItem("profiles")

console.log({checkdata: resourceList})

const TrainingSessionEdit = props => {
    const dataProvider = useDataProvider();

    const transform = (data) => {
        const startDate = new Date(data.start); // User-selected date
        const endDate = new Date(data.end); // User-selected date
        return {
            ...data,
            // Convert the date to ISO 8601 format (UTC)
            start: startDate.toISOString(),
            end: endDate.toISOString(),
        };
    };

   return <Edit resource="trainingsessions" {...props}>
        <section id="trainingsessionEdit">
            <SimpleForm save={(values) => {
                const transformedValues = transform(values);
                dataProvider.update('trainingsessions', { id: transformedValues.id, data: transformedValues });
            }}>
                <TextInput label="title" source={"title"} validate={[required()]} />
                <ReferenceInput source={"relatedUser.id"} reference="profiles" perPage={50}>
                    <AutocompleteInput  
                        label="trainer"
                        source={"relatedUser.id"} 
                        choices={resourceList}
                        filterToQuery={filterToQuery}
                        optionText={(record) => {
                            console.log({shitty:record})
                            return record ? record?.username : 'No Name'}} 
                        validate={[required()]} />
                </ReferenceInput>
                <DateTimeInput label="start" source={"startDate"} validate={[required()]}  
                    format={(value) =>
                        value ? transformToLocalTimezone(value, 'Europe/Amsterdam') : ''
                    }
                /> 
                {/* format={record => console.log("Shit man",record)} */}
                <DateTimeInput label="end" source={"endDate"} validate={[required()]}
                    format={(value) =>
                        value ? transformToLocalTimezone(value, 'Europe/Amsterdam') : ''
                    }
                />
                <BooleanInput label="publish" source={"isPublished"} validate={[required()]} />
                <BooleanInput label="allday" source={"allDay"} validate={[required()]} />
                <ArrayInput source={"subscribedTo"} resource={"profiles"}>
                    <SimpleFormIterator inline>
                        <TextInput helperText={true} source={"username"} />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </section>
    </Edit>
}

export default TrainingSessionEdit