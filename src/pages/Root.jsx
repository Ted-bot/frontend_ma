import { useEffect, useState, useContext, useRef } from 'react'
import { 
  Outlet,
  useLocation,
  matchPath
 } from 'react-router-dom'
import MainNavigation from '../components/navigations/MainNavigation.jsx'
import { ErrorBoundaryContext, ErrorBoundary } from 'react-error-boundary'
import { FallBackRender } from '../components/errors/ErrorBoundrayComponent.jsx'
import { useTabsContext } from '../store/tabs-context.jsx'
import useStore from '../hooks/store/useStore.jsx'
import classes from './Root.module.css'
import { getLocalStorageItem } from '../js/util/getUtil.js'

const patterns = [
  "/:dashboard/:firstKey/:secondKey/:thirdKey",
  "/:dashboard/:firstKey/:secondKey",
  "/dashboard/:firstKey",
  "/dashboard/"
]

export default function Root(){
  const NavbarComponent = <MainNavigation />
  const { pathname } = useLocation()
  const proxyDashboardLogin = pathname === '/dashboard/login' ? '/login' : pathname
  let logoutEventName = 'ra-logout'
  const isUserLoggedOut = localStorage.getItem(logoutEventName)
  const match = patterns.find(path => (matchPath(path, proxyDashboardLogin))) ? true : false
  
  const obj = {message: true, status: 200}
  const standardSyle = 'mt-8 p-4 mb-8 rounded-md text-center'
  const [loggedOut, setLoggedOut] = useState()
  const {state, dispatch} = useTabsContext()
  const [userLoggedIn, setStateInStore, isLoading] = useStore('loggedIn')
  const [userLoggedOut, setUserLoggedOut] = useStore('loggedOut')
  // const ref = useRef()
  // const timeLogOut = new Date(getLocalStorageItem("ra-logout"))
  const timeLogOut = getLocalStorageItem("ra-logout")
  const currentTime = Date.now()
  const timeIntervalLogout = (currentTime - timeLogOut) / 1000
  const showMessageLogOut = timeIntervalLogout < 3.000
  // console.log("What we got? ",ref.current)
  // console.log({"logout Time":timeLogOut})
  // console.log({"Current Time":currentTime})
  // console.log({"TIME INTERVAL LOGOUT":timeIntervalLogout})
  // console.log({"TIME COMPARE":showMessageLogOut})
  
  useEffect(() => {
    if (!timeLogOut) return

    // console.log("Just Logged Out", timeLogOut)
    setLoggedOut(true)

    setTimeout(() => {
      setUserLoggedOut(false)
      setLoggedOut(false)
      localStorage.removeItem('loggedOut')
      localStorage.removeItem('ra-logout')
    }, 3000) 

  }, [userLoggedOut])

  // console.log("Logged_Out_User", userLoggedOut)

  return (
  <>
    {match !== true && NavbarComponent}
    <main className="flex flex-col items-center pt-12">
      <section className="min-w-[360px] w-full ml-2 mr-2 sm:w-full md:min-w-[601px] lg:w-full lg:min-w-[1024px] lg:max-w-[1920px]">
      <ErrorBoundary FallbackComponent={FallBackRender} onError={(error) => console.log({message: `Error (bubbeled up) caught ${error.message}`})}>
      {/* {loggedOut &&  */}
          <section className={`${classes.loggedOut} ${loggedOut ? classes.visiblityLoggedOutActive : classes.visiblityLoggedOutNonActive}`}>
          {/* <section className={` bg-green-300 border border-green-400 text-green-700 ${standardSyle} z-10`}> */}
            {`succesfully logged out`}
          </section>
        {/* } */}
        <Outlet />
      </ErrorBoundary>  
      </section>
    </main>  
  </>
  )
}