import { List, Datagrid, TextField, useListContext, ReferenceManyField, ReferenceArrayField, ReferenceOneField,ArrayField, SimpleFormIterator, BooleanField } from 'react-admin'
import TrainingSessionFilters from './TrainingSessionFilters'
import { NavLink } from 'react-router-dom'
import './TrainingSessionList.css'

const SubscribedTo = () => {
    const { data, resource } = useListContext()
    console.log({TrainingSession_subscribedTo: resource})
    return (
        <ul>
            {data.map((subscribed, index) => (
                <li key={index}>
                    {subscribed.username}
                </li>
            ))}
        </ul>
    )
}

const TrainingSessionList = () => (

    
    <List  filters={TrainingSessionFilters}>
        <section id="trainingsessionlist">
            <Datagrid
                rowClick="show"
            >
                <TextField label="title" source={"title"} />,
                <ReferenceOneField label="relatedUser" source='relatedUser' target={"profiles"} reference={"profiles"}>
                    <TextField source='username' defaultValue={"black dragon trainer"} />    
                </ReferenceOneField>,
                <TextField label="createdAt" source={"createdAt"} />,
                <TextField label="start" source={"startDate"} />,
                <TextField label="end" source={"endDate"} />,
                <ArrayField source="subscribedTo" label="students">
                    <SubscribedTo />
                </ArrayField>
                {/* <ReferenceArrayField
                    source="profiles"
                    reference='subscribedTo'
                    label="subscribedBy"
                /> */}
                
                {/* <ReferenceManyField reference="profiles" source="subscribedTo" target={"id"}>
                    <Datagrid>
                        <TextField source={"id"}/>
                        <TextField source={"username"}/>
                    </Datagrid>
                </ReferenceManyField> */}
            </Datagrid>
        </section>
    </List>
)

export default TrainingSessionList