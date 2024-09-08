import { 
    getLocalStorageItem
 } from "../../../js/util/postUtil"
import Divider from '@mui/material/Divider'
import { alpha } from "@mui/material"

export default function OrderClosureInput({name, qty, price,subscriptionAmount, durationSubscription, totalPrice, subscriptionType, startSubscription, endSubscription}){
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
                            defaultValue={qty}
                        />
                    </section>
                    {subscriptionType != 'unavailable' && <section>
                        <Divider sx={{ borderBottomWidth: 1, marginTop: 1, marginBottom: 1, backgroundColor: alpha('#90caf9', 0.5) }} />
                            <section className="text-neutral-700 font-medium">
                             valid for {subscriptionType == 'month' &&  durationSubscription}   {subscriptionType} 
                            </section>
                                <section className="inline-flex text-sm">
                                    <span className="text-rose-500 font-semibold">{startSubscription}</span>
                                    <span className="text-neutral-500 font-semibold">&nbsp; t/m &nbsp;</span>                            
                                    <span className="text-rose-500 font-semibold">{endSubscription}</span>
                                </section>
                        <Divider sx={{ borderBottomWidth: 1, marginTop: 1, marginBottom: 1, backgroundColor: alpha('#90caf9', 0.5) }} />
                    </section>}
                    <section className="font-bold text-neutral-500/80 sm:text-base md:text-xl">
                        {getLocalStorageItem(currencyType)} 
                        {
                            subscriptionType != 'unavailable' 
                            ? (subscriptionAmount) + ` p/${subscriptionType} ` 
                            : totalPrice
                        }
                    </section>
                        {/* {getLocalStorageItem(currencyType)} {totalPrice} */}
                </section>

            </section>
        </>
    )
}