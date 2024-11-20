
import { useContext } from 'react'
import { Form } from 'react-router-dom'

import Divider from '@mui/material/Divider'
import { alpha } from "@mui/material"
import Dialog from '@mui/material/Dialog'

import {OrderContext} from '../../store/shop-order-context.js'
import UserOrderInfoInterface from '../interface/UserOrderInfoInterface'

import './CalendarModal.css'

import { styled} from '@mui/system'

const DialogComponent = styled('div',{
  name: 'CustomDialog',
  slot: 'Root',
  overridesResolver: (props, styles) => [
    styles.root,
    props.color === 'primary' && styles.primary,
    props.color === 'secondary' && styles.secondary,
  ],
})(({ theme }) => ({
  display: "flex",
  color: 'white',
  background: 'rgba(0 0 0 / 0.5)',
  borderRadius: '5px',
}))


export const UserDataModal = ({updateUserAddressEnteredInputState,  closeDialog, handleKeyDown, errors, enteredInput, enteredInputIsInvalid, formSubmit, dialog}) => {
    
    const {updateUserInput, onBlur} = useContext(OrderContext)
    const typeLocation = 'location'
    const typeText = 'text'
    const typeFirstAndLastName = 'firstAndLastName'
    const typeMixed = 'mixed'      
    
    console.log("ModalEnteredInput", enteredInput)
    
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
                error: errors?.firstAndLastName, 
                required : true, 
                onChange: (e) => updateUserInput('firstAndLastName', e), 
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
                onChange: (e) => updateUserInput('email', e), 
                onBlur: (e) => onBlur('email', e, 'email')
            },
            {
                name: 'Phone Number', 
                id: 'phoneNumber', 
                type: 'tel',
                placeholder: 'type in phone number', 
                value: enteredInput?.phoneNumber,
                invalid: enteredInputIsInvalid.phoneNumber, 
                error: errors?.phoneNumber, 
                required : true, 
                onChange: (e) => updateUserInput('phoneNumber', e), 
                onBlur: (e) => onBlur('phoneNumber', e, 'tel')
            },
        ],
    }

    
    console.log("Got fucking Number", errors?.streetNumber,)
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
                error: errors?.unitNumber,
                onChange: (e) => updateUserInput('unitNumber', e),
                onBlur: (e) => onBlur('unitNumber', e, typeText)},
            {
                name: 'Street Number',
                id: 'streetNumber',
                type: 'number',
                placeholder: 'street number',
                min: 0, 
                value: enteredInput?.streetNumber,
                invalid: enteredInputIsInvalid.streetNumber,
                error: errors?.streetNumber,
                required : true,
                onChange: (e) => updateUserInput('streetNumber', e),
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
                onChange: (e) => updateUserInput('addressLine', e),
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
                onChange: (e) => updateUserInput('postalCode', e),
                onBlur: (e) => onBlur('postalCode', e, typeMixed)
            },
            {
                name: 'Location',
                id: typeLocation,
                error: errors?.location,
                cityId: enteredInput?.city_id,
                stateId: enteredInput?.state_id,
                errorRegion: errors?.region,
                stateError: errors?.reactStateNr, 
                cityError: errors?.reactCityNr,
                type: typeLocation, 
                invalid: enteredInputIsInvalid.city,
                required: true,
                onChangeStateId: e => updateUserInput('state_id',e),
                onChangeState: e => updateUserInput('state',e),
                onChangeCityId: e => updateUserInput('city_id',e),
                onChangeCity: e => updateUserInput('city',e),
                // onChange: (e) => updateUserInput('city', e),
                onBlur : (e) => onBlur('city_id', e, typeLocation)
            },
        ],
    }

    const submitHandler = () => {
        closeDialog()
    }

    return (
        <Dialog 
            open={dialog} 
            fullWidth={true}
            sx={{ backdropFilter: "blur(5px) sepia(5%)", }} 
            PaperProps={{ sx: { borderRadius: "20px" } }}
        > 
            <DialogComponent>
                
                <Form
                    onSubmit={(e) => formSubmit(e)}
                    name='address'
                    id='address'
                    className='w-full'
                >
                     <section className='flex float-end translate-y-4 z-10'>
                        <form  method="dialog" 
                            className="flex w-4 m-6 float-right justify-end"
                        >
                            <button onClick={submitHandler} className='px-2 rounded-md hover:border-2 hover:border-rose-500 hover:bg-rose-300'>X</button>
                        </form>
                    </section>
                    <section className='mt-4'>
                        <h1 className={`flex w-full justify-center pt-3 pb-6 text-2xl`}>{userForm?.name}</h1>
                        {userForm && <UserOrderInfoInterface array={userForm.fields} handleKeyDown={handleKeyDown} />}
                    </section>
                    <Divider sx={{marginRight: '1.2rem', marginLeft: '1.2rem' , borderBottomWidth: 2, marginTop: 2, marginBottom: 1, backgroundColor: alpha('#90caf9', 0.8) }} />
                    <section>
                        <h1 className={`flex justify-center pt-3 pb-6 text-2xl`}>{addressForm?.name}</h1>
                        {userForm && <UserOrderInfoInterface array={addressForm.fields} handleKeyDown={handleKeyDown}/>}
                    </section>
                    <section className='flex w-full justify-center'>
                        <button onClick={submitHandler}
                            className="text-slate-100 h-16 my-8 w-4/5 rounded-b-full text-2xl rounded-t-full border-0 ring-2 shadow-xl ring-red-500 bg-red-500 bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300 hover:from-orange-400 hover:text-yellow-200 hover:to-red-400 hover:ring-red-400 hover:shadow-2xl"
                        >
                            Done
                        </button>
                    </section>
                </Form>
               
            </DialogComponent>
        </Dialog>
    )
}
