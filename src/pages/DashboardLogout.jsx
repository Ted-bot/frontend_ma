import { forwardRef } from 'react'
import { MenuItem } from '@mui/material'
import ExitIcon from '@mui/icons-material/PowerSettingsNew'
import { AppBar, TitlePortal, useLogout} from 'react-admin'

const MyLogoutButton = forwardRef((props, ref) => {
    const logout = useLogout()
    const handleClick = () => logout()
    return (
        <MenuItem
        onClick={handleClick}
        ref={ref}
        // It's important to pass the props to allow Material UI to manage the keyboard navigation
        {...props}
        >
            <ExitIcon /> Logout
        </MenuItem>
    )
})


const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <MyLogoutButton />
    </AppBar>
)

// const MyUserMenu = () => (
//     <UserMenu>
//         <MyLogoutButton />
//     </UserMenu>
// )

// const MyAppBar = () => <AppBar userMenu={<UserMenu />} />

export {MyLogoutButton}
export default MyAppBar