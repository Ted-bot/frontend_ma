import { Menu } from 'react-admin'
import LabelIcon from '@mui/icons-material/Label'
import HomeIcon from '@mui/icons-material/Home'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import SchoolIcon from '@mui/icons-material/School'
import SettingsIcon from '@mui/icons-material/Settings'
import RecentActorsIcon from '@mui/icons-material/RecentActors'
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import inMemoryJwt from '../../js/util/inMemoryJwt'
import { getLocalStorageItem } from '../../js/util/getUtil'

const MyMenu = (roles) => (
    <Menu>
        <Menu.DashboardItem />
        {JSON.parse(getLocalStorageItem('roles'))?.find(role => role === 'ROLE_USER_SIFU') && <div>
        {/* {inMemoryJwt?.getRoles()?.find(role => role === 'ROLE_USER_SIFU') && <div> */}
            <Menu.Item to="/dashboard/users" primaryText="Users" leftIcon={<PeopleAltIcon />} />
            <Menu.Item to="/dashboard/trainingsessions" primaryText="Trainingsessions" leftIcon={<SportsMartialArtsIcon />} />
            <Menu.Item to="/dashboard/profiles" primaryText="Profiles" leftIcon={<RecentActorsIcon />} />
            {/* <Menu.Item to="/dashboard/classes" primaryText="Classes" leftIcon={<SchoolIcon />} />         */}
        </div>}
        <Menu.Item to="/dashboard/notifications" primaryText="Notifications" leftIcon={<NotificationsNoneIcon />} />
        <Menu.Item to="/dashboard/settings" primaryText="Settings" leftIcon={<SettingsIcon />} />
        <Menu.Item to="/dashboard/Calendar" primaryText="Calendar" leftIcon={<CalendarMonthIcon />} />
        <Menu.Item to="./../" primaryText="Home Page" leftIcon={<HomeIcon />} />
        <Menu.Item to="./../subscribe" primaryText="Shop" leftIcon={<ShoppingCartIcon />} />
    </Menu>
)

export {MyMenu}