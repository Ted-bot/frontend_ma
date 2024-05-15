// eslint-disable-next-line react/prop-types
export default function FormWrap({children}){
    
    return (
        <> 
            <section className="flex flex-wrap w-full pt-32 pb-24">
                <section className="hidden bg-gradient-to-r from-transparent 
                to-orange-300 md:flex md:justify-end md:w-1/4 md:py-5 md:pl-2 md:h-full md:rounded-r-full md:bg-no-repeat md:bg-center md:w-100">
                    <section className="w-3/4 h-3/4">
                        <img src="/img/signUp_trans_ini.png" alt="" className="w-[32rem]" />
                    </section> 
                </section>
                <section className="w-full px-3 md:px-0 md:w-1/2 md:flex md:justify-end">
                    <section className="flex justify-center w-full">
                        {children}
                    </section>
                </section>
                <section className="hidden bg-gradient-to-r from-orange-300 md:flex md:items-center md:w-1/4 md:bg-no-repeat md:bg-center md:w-100 md:h-full md:rounded-l-full">
                    <section className="w-3/4 h-3/4 flex-inline justify-items-end">
                        <img src="/img/transparent_wooden_training_dummy.png" alt="" className="w-[32rem]" />
                    </section> 
                </section>
            </section>
        </>
    )
}