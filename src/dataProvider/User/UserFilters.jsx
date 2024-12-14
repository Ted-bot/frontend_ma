import { SearchInput,TextInput, DateInput} from 'react-admin'

const UserFilters = [
    // <SearchInput source="q" alwaysOn/>, //resettable={false} 
    <TextInput label="firstName" source={"firstName"} />,
    <TextInput label="lastName" source={"lastName"}/>,
    <TextInput label="email" source={"email"} />,
    <TextInput label="role" source={"roles"} />,
    <TextInput label="location" source={"location"} />,
    <TextInput label="phone" source={"phoneNumber"} />,
    <DateInput label="birthday" source={"dateOfBirth"} />,
    <TextInput label="gender" source={"gender"} />,
]

export default UserFilters