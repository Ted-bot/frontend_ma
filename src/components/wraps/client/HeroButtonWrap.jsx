export default function HeroButtonWrap({children}){

    return (
        <>
            <section className="flex-wrap inline-flex relative overflow-visible w-full h-10 justify-center">
                
                {children}
            </section>
        </>
    )
}