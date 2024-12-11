import * as React from 'react'
import { DateField, Show, SimpleShowLayout, TextField, ReferenceOneField, ArrayField} from 'react-admin'
import { SubscribedTo } from '../ListProvider/SubscribeTo.jsx'
import { reformatTimeUnit } from '../../js/util/dateUtil'

const TrainingSessionShow = () => (
        <Show>
            <SimpleShowLayout>
                <TextField label="title" source={"title"} />,
                {/* <ReferenceOneField label="relatedUser" source='relatedUser' target={"profiles"} reference={"profiles"}> */}
                    <TextField label="trainer" source='relatedUser.username' defaultValue={"black dragon trainer"} />    
                {/* </ReferenceOneField>, */}
                <DateField label="createdAt" source={"createdAt"} showTime={false} />,
                <DateField label="start" source={"startDate"} showTime={true} transform={record => reformatTimeUnit(record).time} />,
                <DateField label="end" source={"endDate"} showDate={false} showTime={true} transform={record => reformatTimeUnit(record).time}/>,
                <ArrayField source="subscribedTo" label="students signed up">
                    <SubscribedTo />
                </ArrayField>
            </SimpleShowLayout>
        </Show>
)


export default TrainingSessionShow