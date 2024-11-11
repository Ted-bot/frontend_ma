import { forwardRef } from "react"
import inMemoryJwt from "../../../js/util/inMemoryJwt"
import useStore from '../../../hooks/store/useStore.jsx'
import { NavLink } from 'react-router-dom'

const MyLogoutButton = forwardRef((props, ref) => {
    const [userLoggedIn, setUserLoggedIn] = useStore('loggedIn')
    const [userLoggedOut, setUserLoggedOut] = useStore('loggedOut')
    const [message, setMessage] = useStore('message')
    
    const handleClick = () => {
        inMemoryJwt.ereaseToken()
        userLoggedIn && setUserLoggedIn(false)
        userLoggedIn && !userLoggedOut && setUserLoggedOut(true)
        setMessage("successfully logged out!")

        setTimeout(() => {
            setUserLoggedOut(false)
            localStorage.removeItem('loggedOut')
            localStorage.removeItem('ra-logout')
        }, 3000)
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