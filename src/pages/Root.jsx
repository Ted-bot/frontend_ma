import { 
  Outlet,
  useLocation,
  matchPath
 } from 'react-router-dom'
import MainNavigation from '../components/navigations/MainNavigation.jsx'

const patterns = [
  "/:dashboard/:firstKey/:secondKey/:thirdKey",
  "/:dashboard/:firstKey/:secondKey",
  "/dashboard/:firstKey",
  "/dashboard/"
]

function Root(){
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
        <Outlet />
      </section>
    </main>  
  </>
  )
}

export default Root