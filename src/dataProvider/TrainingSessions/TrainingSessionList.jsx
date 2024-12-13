import { List, Datagrid, TextField, DateField, ArrayField, BooleanField } from 'react-admin'
import TrainingSessionFilters from './TrainingSessionFilters'
import { NavLink } from 'react-router-dom'
import './TrainingSessionList.css'
import {SubscribedBy} from '../ListProvider/SubscribeTo.jsx'

const TrainingSessionList = (props) => (

    
    <List {...props} 
        filters={TrainingSessionFilters}
    >
        <section id="trainingsessionlist">
            <Datagrid
                rowClick="show"
            >
                <TextField label="title" source={"title"} />
                {/* <ReferenceOneField label="trainer" source="relatedUser" reference={"profiles"} target={"userUniq"} >
                    <TextField source="username" defaultValue={"black dragon trainer"} />    
                </ReferenceOneField> */}
                <TextField label="trainer" source="relatedUser.username"/>
                <DateField label="createdAt" source={"createdAt"} resource={"createdAt_filterDate_after"} showTime={false}
                    // transform={value =>  new Date(value.substring(0,value.length -6))}
                />
                <DateField label="start" source={"startDate"} transform={value =>  new Date(value.substring(0,value.length -6))} showTime />
                <DateField label="end" source={"endDate"} showDate={false} showTime={true} transform={value =>  new Date(value.substring(0,value.length -6))}/>
                <BooleanField label="published" source={"isPublished"}/>
                <BooleanField label="allday" source={"allDay"}/>
                <ArrayField source="subscribedTo" label="students">
                    <SubscribedBy />
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