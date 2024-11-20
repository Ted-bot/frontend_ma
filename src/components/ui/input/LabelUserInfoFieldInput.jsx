import { useContext } from 'react'
import {OrderContext} from '../../../store/shop-order-context.js'
import NativeSelect from '@mui/material/NativeSelect'
import PhoneInput from 'react-phone-number-input/input'
import LocationInput from './LocationInput.jsx'

export default function LabelUserInfoFieldInput({
    id,
    stateId,
    cityId,
    name,
    type,
    value,
    invalid,
    onBlur,
    error,
    onChange,
    onChangeState,
    onChangeCity,
    onChangeCityId,
    onChangeStateId,
    stateError,
    cityError,
    handleKeyDown,
    ...props}){

        const typeFirstAndLastName = 'firstAndLastName'
        const {currentUserState, currentUserCity, updateUserInput} = useContext(OrderContext)

        if(value === undefined){
            console.log({nan_value: value, id, currentUserCity, currentUserState})
        }
    
    return (
        <>
        <section className={`w-full lg:justify-center px-3 mb-6 md:mb-0`}>
            <label htmlFor="">
                <section>
                    {name}
                </section>
            {
                (type !== 'location' && type !== 'tel') ?
                <input 
                    className={`${error && id != 'unitNumber' && 'border-4 border-rose-500'}
                        w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`
                    } 
                    id={id}
                    onKeyDown={(e) => handleKeyDown(e, value, onChange)}
                    type={type}
                    defaultValue={value}
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.value)}
                    {...props}
                />
                : (type === 'tel') ?
                    <PhoneInput
                        className={`${error && 'border-4 border-rose-500'} 
                        w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight 
                        focus:outline-none focus:bg-white`}
                        country="NL"
                        value={`${value}`}
                        id={id}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                :
                <section className='flex w-full justify-evenly'>
                    <LocationInput 
                        stateId={stateId}
                        cityId={cityId}
                        errorMessage={error} 
                        onChangeCity={onChangeCity}
                        onChangeCityId={onChangeCityId}
                        onChangeState={onChangeState}
                        onChangeStateId={onChangeStateId}
                        cityError={cityError}
                        stateError={stateError}
                    />
                </ section> 
                }
            </label>
            {invalid && id == 'location' && <p className="text-rose-300 text-lg italic">Please set a {name} </p>}
            {invalid && type === typeFirstAndLastName &&  <p className="text-rose-300 text-lg italic">Please fill in your {name} </p>}
            {invalid && type == 'email' &&  <p className="text-rose-300 text-lg italic">Please fill in a {name} </p>}
            {invalid && type == 'text' &&  <p className="text-rose-300 text-lg italic">Please fill in your {name} </p>}
            {invalid && type == 'number' &&  <p className="text-rose-300 text-lg italic">Please fill in your {name} </p>}
            {invalid && type == 'tel' &&  <p className="text-rose-300 text-lg italic">Please fill in your {name}</p>}
            {invalid && type == 'checkbox' &&  <p className="text-rose-300 text-lg italic">Please fill gender</p>}
            {invalid && type == 'date' &&  <p className="text-rose-300 text-lg italic">Select a date between the age 17 and 65</p>}
            {(error != undefined && error != '') && <section className="text-rose-300 text-lg italic">{error}</section>}
        </section>
        </>
    )
}