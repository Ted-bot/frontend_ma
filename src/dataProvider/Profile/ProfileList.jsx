import { 
    ListGuesser,
    FieldGuesser 
} from '@api-platform/admin'

const ProfileList = props => (
    <ListGuesser {...props}>
        <FieldGuesser source={"userName"} />
        <FieldGuesser source={"websiteUrl"} />
        {/* <ListGuesser source={"roles"} validate={[required()]} fullWidth /> */}
        <FieldGuesser source={"description"} />
    </ListGuesser>
)

export default ProfileList