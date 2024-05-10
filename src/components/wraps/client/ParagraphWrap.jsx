export default function ParagraphCard({children}){

    return (
        <>
            <section className="flex-col py-8">
                <section className="w-full text-4xl text-center pb-12 pt-4">
                    <h1 className="text-5xl">Test</h1>
                </section>
                <section className="flex justify-center">
                    <section className="flex flex-wrap w-full justify-center shadow-none lg:shadow-xl md:w-4/5 lg:bg-neutral-100">
                        <section className="flex w-full justify-center py-8 md:w-full lg:w-2/5">
                            {children}
                        </section>
                        {/* <section className="hidden md:hidden lg:w-1/4 lg:flex lg:items-center lg:justify-start ">
                            <section className="relative flex items-center justify-center py-12 rounded-r-full w-full overflow-visible lg:overflow-visible lg:bg-no-repeat">
                                <img className="absolute lg:size-40 lg:sepia" src="/img/symbol_opacity_75_balance.png" alt="" /> 
                            </section>
                        </section>                     */}
                    </section>
                </section>
            </section>
        </>
    )
}