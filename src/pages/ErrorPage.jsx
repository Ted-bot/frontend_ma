import MainContentWrap from '../components/wraps/client/MainContentWrap'
import MainNavigation from '../components/navigations/MainNavigation'
// import Error

export default function ErrorPage({error})
{
    console.log({backDropErrorPage: error})

    return (
        <>
        <MainNavigation />
        <MainContentWrap name="Unknown URL!">
            <section className="text-center text-red-600">
                <section className='mt-8 text-4xl'>{error?.title ?? '404: Page Not Found!'}</section>
            </section>
        </MainContentWrap>
    </>)
}