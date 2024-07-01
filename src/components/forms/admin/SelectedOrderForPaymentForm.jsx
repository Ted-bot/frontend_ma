import SelectedOrderForPaymentInterface from "../../interface/SelectedOrderForPaymentInterface"

export default function SelectedOrderForPaymentForm(){

    return(
        <>
            <section className="flex flex-col shadow-md bg-slate-100 py-5 rounded-md px-3 sm:mx-4 w-full sm:px-5 sm:w-4/5 md:px-3 md:shadow-xl">
                <section>
                    <h1 className={`flex justify-center pt-3 pb-6 text-2xl`}>Order</h1>
                </section>
                <form action="" name='address' id='address'>
                    <SelectedOrderForPaymentInterface />
                </form>
            </section>
        </>
    )
}