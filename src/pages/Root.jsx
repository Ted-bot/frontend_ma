import { 
  Outlet,
  useLocation,
  matchPath
 } from 'react-router-dom'
import MainNavigation from '../components/navigations/MainNavigation.jsx'
import { ErrorBoundaryContext, ErrorBoundary } from 'react-error-boundary'
import { FallBackRender } from '../components/errors/ErrorBoundrayComponent.jsx'

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
  // console.log({patname: pathname, proxy: proxyDashboardLogin})
  const match = patterns.find(path => (matchPath(path, proxyDashboardLogin))) ? true : false

  return (
  <>
    {match !== true && NavbarComponent}
    <main className="flex flex-col items-center pt-12">
      <section className="min-w-[360px] w-full ml-2 mr-2 sm:w-full md:min-w-[601px] lg:w-full lg:min-w-[1024px] lg:max-w-[1920px]">
      <ErrorBoundary FallbackComponent={FallBackRender} onError={(error) => console.log({message: `Error (bubbeled up) caught ${error.message}`})}>
        <Outlet />
      </ErrorBoundary>  
      </section>
    </main>  
  </>
  )
}