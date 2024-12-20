import { useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import TextField from '@mui/material/TextField'
import 'react-phone-number-input/style.css'
import { MuiTelInput } from 'mui-tel-input'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import NativeSelect from '@mui/material/NativeSelect'
import { camelCaseToLoWithSpace } from '../../../js/util/postUtil'

import LocationInput from './LocationInput.jsx'

/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
export default function LabelNameInput({ 
    id,
    name, 
    type, 
    error = false,
    invalid,
    cityId,
    cityError, 
    stateId,
    stateError,
    defaultValue = '',
    value = '',
    onChange,
    onBlur,
    onChangeState,
    onChangeStateId,
    onChangeCity,
    onChangeCityId,
}) {
    let checkBox = 0    
    const lowerCaseName = camelCaseToLoWithSpace(name)

    if(type === 'checkbox') checkBox = 1
    if(id === 'email') console.log({defaultValue:defaultValue})
    
    const [phoneNumber, setPhoneNumber] = useState(defaultValue);
  //const [phoneNumber, setPhoneNumber] = useState("+18182925620");

  const onPhoneChanged = (val) => {
    console.log({new_phone_number: val})
    onChange(val)
    setPhoneNumber(val)
  }
  if(id === 'street_number'){
      console.log({Is_Invalid_StreetNumber : invalid})
  }

    return (
        <>
            <section className={`w-full md:w-[80] lg:justify-center px-3 mb-6 md:mb-0`}>
                <label className={`w-full tracking-wide text-gray-700 text-xs font-bold mb-2`}>
                    <section className='mt-5'>
                    {
                        (type === 'text' || type === 'password' || type === 'number' ) ?  //&& type != 'location'
                            <section >
                                {/* ${error && 'border-red-500'}  */}
                            <TextField
                                className='w-full'
                                error={error}
                                // className={`${checkBox === 1 ? 'h-8 w-8 lg:h-8 lg:w-12 accent-orange-300' : 'w-full appearance-none'}                                 
                                // block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} 
                                id={id}
                                // defaultValue={defaultValue}
                                value={value}
                                name={name} 
                                label={name}
                                type={type}
                                onChange={onChange}
                                onBlur={onBlur}
                                variant="outlined"
                                // helperText={`Incorrect Entry ${name}`}
                            />
                                {/* {invalid && type == 'checkbox' &&  <p className="text-red-500 text-xs italic"> Select gender</p>} */}
                            </section>
                        : type === 'date' ?
                            <DatePicker 
                                className='w-full'
                                label={name}
                                // defaultValue={defaultValue}
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        : type === 'tel' ?
                            <MuiTelInput
                                className='w-full'
                                // country='NL'
                                id={id}
                                // defaultCountry="NL"
                                // className={`${error && 'border-red-500'} 
                                // w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight 
                                // focus:outline-none focus:bg-white`}
                                label={name}
                                onChange={onPhoneChanged}
                                onBlur={onBlur}
                                value={phoneNumber}
                                // sx={{height: 100}}
                            />
                        : type === 'checkbox' ?
                            <section>
                                
                                <input
                                    className={`${checkBox === 1 ? 'h-8 w-8 lg:h-8 lg:w-12 accent-orange-300' : 'w-full appearance-none'} 
                                    ${error && 'border-red-500'} 
                                    block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} 
                                    id={id}
                                    name={name} 
                                    type={type}
                                    />
                                    {type === 'checkbox' && <section className={`${checkBox === 1 ? 'text-center' : ''}`}>
                                        {name}                
                                    </section>}
                                    {invalid && type == 'checkbox' &&  <p className="text-red-500 text-xs italic"> Select gender</p>}
                            </section>
                        :
                        <>
                            <section className='flex w-full justify-evenly'>
                                <LocationInput 
                                    stateId={stateId}
                                    cityId={cityId}
                                    errorMessage={error} 
                                    onChangeState={onChangeState}
                                    onChangeStateId={onChangeStateId}
                                    onChangeCity={onChangeCity}
                                    onChangeCityId={onChangeCityId}
                                    cityError={cityError}
                                    stateError={stateError}
                                />
                            </ section> 
                        </>
                    }
                    </section>
                </label>
                {invalid && type == 'password' &&  <p className="text-red-500 text-xs italic">Please fill in a {lowerCaseName} </p>}
                {invalid && type == 'location' &&  <p className="text-red-500 text-xs italic">Please fill in a {lowerCaseName} </p>}
                {invalid && type == 'text' &&  <p className="text-red-500 text-xs italic">Please fill in your {lowerCaseName} </p>}
                {invalid && type == 'date' &&  <p className="text-red-500 text-xs italic  text-center">Selected date cannot be processed</p>}
                {invalid && type == 'tel' &&  <p className="text-red-500 text-xs italic">Please fill in your {lowerCaseName}</p>}
                {(error != undefined && error != '') && <section className="text-red-500 text-xs italic">{error}</section>}               
                
            </section>
        </>
    )
}
