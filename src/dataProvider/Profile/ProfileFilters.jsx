import { SearchInput,TextInput} from 'react-admin'

const ProfileFilters = [
    <SearchInput source="q" alwaysOn/>, //resettable={false}
    <TextInput source={"username"} />,
    // <TextInput source={"websiteUrl"} />,
    <TextInput source={"tokenManagers"} />,
    <TextInput source={"description"} />,
]

export default ProfileFilters