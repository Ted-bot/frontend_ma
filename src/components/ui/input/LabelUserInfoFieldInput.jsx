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
                    className={`${invalid && id != 'unitNumber' && 'border-4 border-rose-500'}
                        w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`
                    } 
                    ref={ref}
                    id={id}
                    // name={name} 
                    type={type}
                    defaultValue={value}
                    {...props}
                />
                : type == 'tel' ?
                    <PhoneInput
                        className={`${invalid && 'border-4 border-rose-500'} 
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
                            className={`${invalid && 'border-4 border-rose-500 '}w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
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
                            className={`${invalid && 'border-4 border-rose-500 '}w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                            id={id}
                            onChange={(e) => userSelectedLocation('city', e)}
                            // value={etst}
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
            {invalid && id != 'unit_number' && ref?.current?.value == '' && <p className="text-rose-300 text-lg italic">Please fill in a {name} </p>}
            {invalid && id == 'location' && <p className="text-rose-300 text-lg italic">Please set a {name} </p>}
        </section>
        </>
    )
}