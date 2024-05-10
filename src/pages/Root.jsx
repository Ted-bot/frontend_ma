import { Outlet } from 'react-router-dom'
import MainNavigation from '../components/navigations/MainNavigation.jsx'
// import classes from './Root.module.css'

function Root(){
    return (
    <>
      <MainNavigation />
      {/* <main className={classes.content}> */}
      <main className="flex flex-col items-center pt-12">
        <section className="min-w-[360px] w-full ml-2 mr-2 sm:w-full md:min-w-[601px] lg:w-full lg:min-w-[1024px] lg:max-w-[1920px]">
          <Outlet />
        </section>
      </main>  
    </>
)
}

export default Root