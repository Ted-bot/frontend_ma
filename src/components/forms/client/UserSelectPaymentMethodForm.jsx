import { useState } from "react"
import IconRight from "../../../assets/IconRight"
import IconUserLocation from "../../../assets/IconUserLocation"
import IconIdeal from "../../../assets/ideal.svg"
import IconCredit from "../../../assets/creditcard.svg"
import IconPaypal from "../../../assets/paypal.svg"

const UserSelectPaymentMethodForm = ({selectedType, symbol, paymentMethodModalHandler, errorClass}) => {  

    return (
        <>
            <section className="grid justify-items-center">
                <section 
                    onClick={paymentMethodModalHandler}
                    className={`${errorClass ?? errorClass} inline-flex border-4 rounded-lg border-slate-300 py-10 cursor-pointer sm:w-full md:w-3/5 hover:bg-slate-200`}
                >
                    <section className="grow-0 px-6 content-center">
                        {symbol == 'ideal' && <img src={IconIdeal} alt="Your SVG iDeal" />}
                        {symbol == 'credit_card' && <img src={IconCredit} alt="Your SVG CreditCard" />}
                        {symbol == 'pay_pal' && <img src={IconPaypal} alt="Your SVG PayPal" />}                        
                    </section>
                    <section className="grow flex-col">
                        <section className="text-lg font-semibold">Complete payment with</section>
                        <section>
                            {selectedType}
                        </section>
                    </section>
                    <section className="grow-0 px-6 content-center">
                        <IconRight />
                    </section>
                </section>
            </section>
        </>
    )

}

export default UserSelectPaymentMethodForm