import { SearchInput,TextInput} from 'react-admin'

const TrainingSessionFilters = [
    <SearchInput source="q" alwaysOn/>, //resettable={false} 
    <TextInput label="title" source={"title"} />,
    <TextInput label="relatedUser" source={"relatedUser"} />,
    <TextInput label="createdAt" source={"createdAt"} />,
    <TextInput label="start" source={"startDate"} />,
    <TextInput label="end" source={"endDate"} />,
    <TextInput label="isPublised" source={"isPublised"}/>,
    <TextInput label="entries" source={"subscribedTo"} />,
]

export default TrainingSessionFilters