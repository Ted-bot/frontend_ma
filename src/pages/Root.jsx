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

const dashboardPatterns = [
  "/dashboard/signup"
]

export default function Root(){
  const NavbarComponent = <MainNavigation />
  const { pathname } = useLocation()
  const proxyDashboardLogin = pathname === '/dashboard/login' ? '/login' : pathname
  let logoutEventName = 'ra-logout'
  const isUserLoggedOut = localStorage.getItem(logoutEventName)
  const match = patterns.find(path => (matchPath(path, proxyDashboardLogin))) ? true : false
  const dashboardMatch = dashboardPatterns.find(path => (!matchPath(path, proxyDashboardLogin))) ? true : false
  
  const obj = {message: true, status: 200}
  const standardSyle = 'mt-8 p-4 mb-8 rounded-md text-center'
  const [loggedOut, setLoggedOut] = useState()
  const {state, dispatch} = useTabsContext()
  // const [userLoggedIn, setStateInStore, isLoading] = useStore('loggedIn')
  const [message, setMessage] = useStore('message')
  const [userLoggedOut, setUserLoggedOut] = useStore('loggedOut')
  const [success, setSuccess] = useStore('success')
  const [error, setError] = useStore('error')
  const timeLogOut = getLocalStorageItem("ra-logout")
  
  useEffect(() => {
    if (success) {
        setTimeout(() => {
          setMessage(false)          
          setSuccess(false)
        }, 4000) 
    } else if (error){
        setTimeout(() => {
          setMessage(false)
          setError(false)
        }, 4000) 
    }
  }, [success, error])

  return (
  <>
    {match !== true && NavbarComponent}
    {dashboardMatch !== true && NavbarComponent}
    <main className={!match ? "flex flex-col items-center pt-12" : ''}>
      <section className={!match ? "min-w-[360px] w-full ml-2 mr-2 sm:w-full md:min-w-[601px] lg:w-full lg:min-w-[1024px] lg:max-w-[1920px]" : ''}>
      <ErrorBoundary FallbackComponent={FallBackRender} onError={(error) => console.log({message: `Error (bubbeled up) caught ${error.message}`})}>
    
          <section
            className={`${classes.displayMessage}
              ${message ? classes.visiblityMessageActive : classes.visiblityMessageNonActive}
              ${success ? classes.successDisplay : (error && classes.errorDisplay)}`
          }>
            {message}
          </section>
        <Outlet />
      </ErrorBoundary>  
      </section>
    </main>  
  </>
  )
}