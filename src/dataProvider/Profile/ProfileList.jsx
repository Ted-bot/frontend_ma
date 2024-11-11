import { 
    ListGuesser,
    FieldGuesser 
} from '@api-platform/admin'

const ProfileList = props => (
    <ListGuesser {...props}>
        <FieldGuesser source={"username"} />
        <FieldGuesser source={"websiteUrl"} />
        <FieldGuesser source={"tokenManagers"} />
        {/* <ListGuesser source={"roles"} validate={[required()]} fullWidth /> */}
        <FieldGuesser source={"description"} />
    </ListGuesser>
)

export default ProfileList