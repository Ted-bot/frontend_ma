import MainContentWrap from '../components/wraps/client/MainContentWrap';
import MainNavigation from '../components/navigations/MainNavigation';
export default function ErrorPage()
{
    // console.log({props})

    return (
        <>
        <MainNavigation />
        <MainContentWrap name="An error occurred!">
            <section className="text-center text-red-600">
                {/* <h1 className='mt-8 text-4xl'></h1> */}
                <section className='mt-8'>404: Page Not Found!</section>
                {/* <section className='mt-8'>{errorElement}</section> */}
            </section>
        </MainContentWrap>
    </>)
}