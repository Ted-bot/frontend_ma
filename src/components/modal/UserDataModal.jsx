
import { forwardRef, useImperativeHandle, useRef, useContext } from 'react'
import { createPortal } from 'react-dom'
import { Form } from 'react-router-dom'

import Divider from '@mui/material/Divider'
import { alpha } from "@mui/material"
import {OrderContext} from '../../store/shop-order-context'
import UserOrderInfoInterface from '../interface/UserOrderInfoInterface'

import './CalendarModal.css'

const UserDataModal = forwardRef(function UserDataModal({ errors, enteredInput, enteredInputIsInvalid, formSubmit}, ref){
    
    const {userSelectedLocation, onBlur} = useContext(OrderContext)
    const dialog = useRef()
    const typeLocation = 'location'
    const typeText = 'text'
    const typeFirstAndLastName = 'firstAndLastName'
    const typeMixed = 'mixed'
    
    useImperativeHandle(ref, () => {
    
        return {
            open(){
                dialog.current.showModal()
            }
            // close(){
            //     dialog.current.close()
            // }
        }
    })
    
    const userForm = {
        name: 'Personal Information',
        fields : [
            {
                name: 'First- and LastName', 
                id: 'firstAndLastName', 
                type: typeFirstAndLastName, 
                placeholder: 'type first and last name', 
                value: enteredInput?.firstAndLastName,
                invalid: enteredInputIsInvalid.firstAndLastName, 
                error: errors?.first_and_last_name, 
                required : true, 
                onChange: (e) => userSelectedLocation('firstAndLastName', e), 
                onBlur: (e) => onBlur('firstAndLastName', e, typeFirstAndLastName)
            },
            {
                name: 'E-mail', 
                id: 'email', 
                type: 'email', 
                placeholder: 'email', 
                autoComplete: 'email',
                value: enteredInput?.email,
                invalid: enteredInputIsInvalid.email, 
                error: errors?.email, 
                required : true, 
                onChange: (e) => userSelectedLocation('email', e), 
                onBlur: (e) => onBlur('email', e, 'email')
            },
            {
                name: 'Phone Number', 
                id: 'phoneNumber', 
                type: 'tel', 
                placeholder: 'type in phone number', 
                value: enteredInput?.phoneNumber,
                invalid: enteredInputIsInvalid.phoneNumber, 
                error: errors?.phone_number, 
                required : true, 
                onChange: (e) => userSelectedLocation('phoneNumber', e, 'tel'), 
                onBlur: (e) => onBlur('phoneNumber', e, 'tel')
            },
        ],
    }
    
    const addressForm = {
        name: 'Address',
        fields : [
            {
                name: 'Unit Number',
                id: 'unitNumber',
                type: typeText,
                placeholder: 'unit number',
                value: enteredInput?.unitNumber,
                invalid: enteredInputIsInvalid.unitNumber,
                error: errors?.unit_number,
                onChange: (e) => userSelectedLocation('unitNumber', e),
                onBlur: (e) => onBlur('unitNumber', e, typeText)},
            {
                name: 'Street Number',
                id: 'streetNumber',
                type: 'number',
                placeholder: 'street number',
                min: 0, 
                value: enteredInput?.streetNumber,
                invalid: enteredInputIsInvalid.streetNumber,
                error: errors?.street_number,
                required : true,
                onChange: (e) => userSelectedLocation('streetNumber', e),
                onBlur: (e) => onBlur('streetNumber', e, 'number')},
            {
                name: 'Street Name',
                id: 'addressLine',
                type: typeText,
                placeholder: 'address line',
                value: enteredInput?.addressLine,
                invalid: enteredInputIsInvalid.addressLine,
                error: errors?.address_line,
                required : true,
                onChange: (e) => userSelectedLocation('addressLine', e),
                onBlur: (e) => onBlur('addressLine', e, typeText)},
            {
                name: 'Postal Code',
                id: 'postalCode',
                type: typeMixed,
                placeholder: 'postal code',
                value: enteredInput?.postalCode,
                invalid: enteredInputIsInvalid.postalCode,
                error: errors?.postalCode,
                required : true,
                onChange: (e) => userSelectedLocation('postalCode', e),
                onBlur: (e) => onBlur('postalCode', e, typeMixed)
            },
            {
                name: 'Location',
                id: typeLocation,
                error: errors?.location,
                errorRegion: errors?.region,
                type: typeLocation, 
                invalid: enteredInputIsInvalid.city,
                required: true,
                onBlur : (e) => onBlur('city', e, typeLocation)
            },
        ],
    }


    return createPortal(
        <dialog ref={dialog} className="result-modal w-full md:w-3/4 lg:w-[32rem]">
            <section>
                <form
                    method="dialog" 
                    className="flex w-4 float-right justify-end"
                >
                    <button className='px-2 rounded-md hover:border-2 hover:border-rose-500 hover:bg-rose-300'>X</button>
                </form>
                <Form
                    onSubmit={(e) => formSubmit(e)}
                    name='address'
                    id='address'
                >
                    <section>
                        <h1 className={`flex justify-center pt-3 pb-6 text-2xl`}>{userForm?.name}</h1>
                        {userForm && <UserOrderInfoInterface array={userForm.fields} />}
                    </section>
                    <Divider sx={{marginRight: '1.2rem', marginLeft: '1.2rem' , borderBottomWidth: 2, marginTop: 2, marginBottom: 1, backgroundColor: alpha('#90caf9', 0.8) }} />
                    <section>
                        <h1 className={`flex justify-center pt-3 pb-6 text-2xl`}>{addressForm?.name}</h1>
                        {userForm && <UserOrderInfoInterface array={addressForm.fields} />}
                    </section>
                    <button 
                        className="text-slate-100 h-16 w-42 mt-8 px-8 align-content-center w-full rounded-b-full text-2xl rounded-t-full border-0 ring-2 shadow-xl ring-red-500 bg-red-500 bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300 hover:from-orange-400 hover:text-yellow-200 hover:to-red-400 hover:ring-red-400 hover:shadow-2xl"
                    >
                        Done
                    </button>
                </Form>
            </section>
        </dialog>,
        document.getElementById("modal")
    )
})

export default UserDataModal