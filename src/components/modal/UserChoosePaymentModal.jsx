import { forwardRef, useImperativeHandle, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Form } from 'react-router-dom'
import SelectPaymentMethodInterface from '../interface/SelectPaymentMethodInterface'

import Divider from '@mui/material/Divider'
import { alpha } from "@mui/material"

import './CalendarModal.css'

 const UserChoosePaymentModal = forwardRef(function UserDataModal({ paymentMethodOptions}, ref){
    const dialog = useRef()

    useImperativeHandle(ref, () => {

        return {
            open(){
                dialog.current.showModal()
            }
        }
    })
    
    return createPortal(
        <dialog ref={dialog} className="result-modal w-full md:w-[24rem] xl:w-[36rem]">
            <form method="dialog" className="flex w-4 float-right justify-end">
                <button className='px-2 rounded-md hover:border-2 hover:border-rose-500 hover:bg-rose-300'>X</button>
            </form>
            <form
                // onSubmit={(e) => formAction(e)}
                method="dialog"
                name='address'
                id={paymentMethodOptions.name}
            >
                <section>
                    <h1 className={`flex justify-center pt-3 pb-6 text-md md:text-xl lg:text-xl xl:text-2xl`}>Choose a Payment Method</h1>

                    <SelectPaymentMethodInterface availableMethods={paymentMethodOptions.fields} />
                    
                    <Divider sx={{ borderBottomWidth: 1, marginTop: 3, marginBottom: 3, backgroundColor: alpha('#90caf9', 0.5)}} variant="middle" component="div"  /> 

                    <button
                        className="text-slate-100 h-16 w-42 px-8 align-content-center w-full rounded-b-full text-2xl rounded-t-full border-0 ring-2 shadow-xl ring-red-500 bg-red-500 bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300 hover:from-orange-400 hover:text-yellow-200 hover:to-red-400 hover:ring-red-400 hover:shadow-2xl"
                    >
                            Close
                    </button>
                </section>
            </form>
        </dialog>,
        document.getElementById("modal")
    )
})

export default UserChoosePaymentModal