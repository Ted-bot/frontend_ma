import { Menu } from 'react-admin'
import LabelIcon from '@mui/icons-material/Label'

const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.Item to="/dashboard/users" primaryText="Users" leftIcon={<LabelIcon />} />
        <Menu.Item to="/dashboard/trainingsessions" primaryText="Trainingsessions" leftIcon={<LabelIcon />} />
        <Menu.Item to="/dashboard/profiles" primaryText="Profiles" leftIcon={<LabelIcon />} />
        <Menu.Item to="/dashboard/classes" primaryText="Classes" leftIcon={<LabelIcon />} />
        <Menu.Item to="/dashboard/settings" primaryText="Settings" leftIcon={<LabelIcon />} />
    </Menu>
)

export default MyMenu