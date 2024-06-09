import { 
    CreateGuesser,
    InputGuesser
} from '@api-platform/admin'

import { required } from 'react-admin'

const UserCreate = props => (
    <CreateGuesser {...props}>
        <InputGuesser source={"firstName"} validate={[required()]} fullWidth />
        <InputGuesser source={"lastName"} validate={[required()]} fullWidth />
        <InputGuesser source={"email"} validate={[required()]} fullWidth />
        {/* <InputGuesser source={"roles"} validate={[required()]} fullWidth /> */}
        <InputGuesser source={"password"} validate={[required()]} fullWidth />
        <InputGuesser source={"phoneNumber"} validate={[required()]} fullWidth />
        <InputGuesser source={"dateOfBirth"} validate={[required()]} fullWidth />
        <InputGuesser source={"gender"} validate={[required()]} fullWidth />
        <InputGuesser source={"location"} validate={[required()]} fullWidth />
        <InputGuesser source={"conversion"} validate={[required()]} fullWidth />
    </CreateGuesser>
)

export default UserCreate