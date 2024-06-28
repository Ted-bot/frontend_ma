export default function FeatureCardsWrap({children, name}) {

    return (
        <>
            <section className="flex-col pb-8">
                <section className="w-full text-center pt-2 pb-[10rem] sm:pt-4 sm:pb-[6rem] md:pt-2 md:pb-[6rem] lg:pb-[8rem] xl:pt-2 2xl:pb-[10rem]">
                    <h2 className="translate-y-16 text-5xl sm:translate-y-12 lg:translate-y-12 xl:translate-y-16 2xl:translate-y-24">{name ? name : 'No name prop set for wrap'}</h2>
                </section>
                <section className="flex flex-wrap mx-0 h-1/2 py-50 justify-center sm:justify-center lg:justify-around">
                    {children}
                </section>
            </section>
        </>
    )
}