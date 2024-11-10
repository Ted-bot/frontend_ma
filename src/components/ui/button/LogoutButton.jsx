import { forwardRef } from "react"
import inMemoryJwt from "../../../js/util/inMemoryJwt"
import useStore from '../../../hooks/store/useStore.jsx'
import { NavLink } from 'react-router-dom'

const MyLogoutButton = forwardRef((props, ref) => {
    const [userLoggedIn, setUserLoggedIn] = useStore('loggedIn')
    const [userLoggedOut, setUserLoggedOut] = useStore('loggedOut')
    
    const handleClick = () => {
        inMemoryJwt.ereaseToken()
        userLoggedIn && setUserLoggedIn(false)
        userLoggedIn && !userLoggedOut && setUserLoggedOut(true)
    }
    
    return (
        <NavLink
            onClick={handleClick}
            ref={ref}
            // It's important to pass the props to allow Material UI to manage the keyboard navigation
            {...props} 
        >
            {/* <ExitIcon />  */}
            Logout
        </NavLink>
    )
})

export default MyLogoutButton