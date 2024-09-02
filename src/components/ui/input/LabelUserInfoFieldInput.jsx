import { useRef, useState, useContext } from 'react'
import {OrderContext} from '../../../store/shop-order-context'
import NativeSelect from '@mui/material/NativeSelect'
import PhoneInput from 'react-phone-number-input/input'

export default function LabelUserInfoFieldInput({
    id,
    state_id,
    name,
    type,
    value,
    invalid,
    onBlur,
    error,
    errorRegion,
    ...props}){

        let optionStateList = []
        let optionCitiesList = []
        const ref = useRef()
        const {availableCities, availableStates, currentUserState, currentUserCity, userSelectedLocation} = useContext(OrderContext)
    
        if(type === 'location'){
            optionStateList = availableStates.map((state) => ({
                label: state.name,
                value: state.id
            }))
            
            optionCitiesList = availableCities.map((city) => ({
                label: city.name,
                value: city.id
            }))
        }

        console.log({indiError: error})
        
    return (
        <>
        <section className={`w-full lg:justify-center px-3 mb-6 md:mb-0`}>
            <label htmlFor="">
                <section>
                    {name}
                </section>
            {
                (type != 'location' && type != 'tel') ?
                <input 
                // ${ error != undefined && error != '' && 'border-red-500'} 
                    className={`${error && id != 'unitNumber' && 'border-4 border-rose-500'}
                        w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`
                    } 
                    ref={ref}
                    id={id}
                    // name={name} 
                    type={type}
                    defaultValue={value}
                    onBlur={onBlur}
                    {...props}
                />
                : type == 'tel' ?
                    <PhoneInput
                        className={`${error && 'border-4 border-rose-500'} 
                        w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight 
                        focus:outline-none focus:bg-white`}
                        country="NL"
                        ref={ref}
                        value={`${value}`}
                        id={id}
                        {...props}
                    />
                :
                    <section className='flex w-full justify-evenly'>
                        <NativeSelect
                            className={`${errorRegion && 'border-4 border-rose-500 '}w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                            id={state_id}
                            onChange={(e) => userSelectedLocation('state', e)}
                            value={currentUserState}
                        >
                            {
                                optionStateList instanceof Array && 
                                optionStateList?.length > 0 && 
                                optionStateList?.map((value, index) => (<option key={index} value={value.value}>{value.label}</option>))
                            }
                        </NativeSelect>
                        <NativeSelect
                            className={`${error && 'border-4 border-rose-500 '}w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                            id={id}
                            onChange={(e) => userSelectedLocation('city', e)}
                            // onClose{onBlur}
                            value={currentUserCity}
                        >
                            {
                                optionCitiesList instanceof Array && 
                                optionCitiesList?.length > 0 && 
                                optionCitiesList.map((value, index) => (<option key={index} value={value.value}>{value.label}</option>))
                            }
                        </NativeSelect>
                    </ section>
                }
            </label>

            {/* {invalid && id != 'unit_number' && ref?.current?.value == '' && <p className="text-rose-300 text-lg italic">Please fill in a {name} </p>} */}
            {invalid && id == 'location' && <p className="text-rose-300 text-lg italic">Please set a {name} </p>}
            {invalid && type == 'email' &&  <p className="text-rose-300 text-lg italic">Please fill in a {id} </p>}
            {invalid && type == 'text' &&  <p className="text-rose-300 text-lg italic">Please fill in your {id} </p>}
            {invalid && type == 'number' &&  <p className="text-rose-300 text-lg italic">Please fill in your {id} </p>}
            {invalid && type == 'tel' &&  <p className="text-rose-300 text-lg italic">Please fill in your {id}</p>}
            {invalid && type == 'checkbox' &&  <p className="text-rose-300 text-lg italic">Please fill gender</p>}
            {invalid && type == 'date' &&  <p className="text-rose-300 text-lg italic">Sorry, only between the age of 7 and 60 years can sign in!</p>}
            {(error != undefined && error != '') && <section className="text-rose-300 text-lg italic">{error}</section>}
            {(errorRegion != undefined && error != '') && <section className="text-rose-300 text-lg italic">{errorRegion}</section>}
        </section>
        </>
    )
}