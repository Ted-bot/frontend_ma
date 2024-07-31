import IconBxCheck from "../../../assets/IconBxCheck"
import IconIdeal from "../../../assets/ideal.svg"
import IconCredit from "../../../assets/creditcard.svg"
import IconPaypal from "../../../assets/paypal.svg"

const CustomPaymentOptionButton = ({name, id, value, onClick}) => {

    return (
        <>
            <label>
                <section 
                    onClick={onClick}
                    className={`${value && "bg-slate-400"} border-4 rounded-xl p-2 m-2 bg-slate-500/8 hover:bg-slate-300 w-full`}
                >
                    <section className="inline-flex w-full">
                        <section className="content-center grow-0 p-4 px-6" >
                            {id == 'ideal' && <img src={IconIdeal} alt={`paying with ${name}`} />}
                            {id == 'credit_card' && <img src={IconCredit} alt={`paying with ${name}`} />}
                            {id == 'pay_pal' && <img src={IconPaypal} alt={`paying with ${name}`} />   }
                        </section>
                        <section className="content-center grow p-4">
                            {name}
                        </section>
                        <section className="content-center grow-0 p-4 px-6">{value && <IconBxCheck />}</section>
                    </section>
                </section>
                <input type="hidden" id={id} value={value == undefined ? false : value} />
            </label>
        </>
    )
}

export default CustomPaymentOptionButton