import { Menu } from 'react-admin'
import LabelIcon from '@mui/icons-material/Label'

const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.Item to="/dashboard/users" primaryText="users" leftIcon={<LabelIcon />} />
        <Menu.Item to="/dashboard/trainingsessions" primaryText="trainingsessions" leftIcon={<LabelIcon />} />
        <Menu.Item to="/dashboard/profiles" primaryText="profiles" leftIcon={<LabelIcon />} />
        <Menu.Item to="/dashboard/classes" primaryText="classes" leftIcon={<LabelIcon />} />
    </Menu>
)

export default MyMenu