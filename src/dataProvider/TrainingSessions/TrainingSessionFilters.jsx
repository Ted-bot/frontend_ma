import { SearchInput,TextInput, DateInput, BooleanInput } from 'react-admin'

const TrainingSessionFilters = [
    // <SearchInput source="q" alwaysOn/>, //resettable={false} 
    <TextInput label="title" source={"title"} />,
    <TextInput label="trainer" source={"relatedUser"} />,
    <DateInput label="CreatedAt < Before" source={"createdAt_lte"}/>,
    <DateInput label="CreatedAt > After" source={"createdAt_gte"}/>,
    <DateInput label="StartDate < Before" source={"startDate_lte"} />,
    <DateInput label="StartDate > After" source={"startDate_gte"}/>,
    <DateInput label="End < Before" source={"endDate_lte"} />,
    <DateInput label="End > After" source={"endDate_gte"} />,
    <BooleanInput label="isPublished" source={"isPublished"}/>,
    <BooleanInput label="allDay" source={"allDay"}/>,
]

export default TrainingSessionFilters