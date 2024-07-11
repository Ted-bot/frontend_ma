import { 
    getLocalStorageItem
 } from "../../../js/util/postUtil"

export default function OrderClosureInput({name, qty, price, totalPrice}){
    const currencyType = 'EUR'
    // console.log({price})
    return (
        <>
            <section className="flex-col grid justify-items-center justify-self-center rounded-lg border-4 border-slate-300 my-2 py-8 text-left sm:w-full md:w-3/5">
                {/* <label className=""> */}
                <section>
                    <section className="text-neutral-500/80 justify-center sm:text-sm md:text-base">
                        {name}                
                    </section>
                    <section className="inline-flex py-2 text-neutral-500/80 sm:text-sm md:text-base">
                        <section className="mr-2 font-medium">Quantity</section>
                        <input 
                            className="w-8 bg-opacity-100 font-bold rounded-md text-center"
                            type="text"
                            value={qty}
                        />
                    </section>
                    <section className="font-bold text-neutral-500/80 sm:text-base md:text-xl">
                    {getLocalStorageItem(currencyType)} {totalPrice}
                    </section>
                </section>

            </section>
        </>
    )
}