import { useState } from 'react'
import TextField from '@mui/material/TextField'
import 'react-phone-number-input/style.css'
import { MuiTelInput } from 'mui-tel-input'

import { camelCaseToLoWithSpace } from '../../../js/util/postUtil'

import LocationInput from './LocationInput.jsx'
import { DatePickerNewUserInput } from './DatePickerNewUserInput.jsx'

export default function LabelNameInput({ 
    id = 0,
    name, 
    type, 
    error = false,
    invalid,
    cityId = 0,
    cityError, 
    stateId = 0,
    stateError,
    defaultValue = '',
    value,
    onChange,
    onBlur,
    checked
}) {
    let checkBox = 0    
    const lowerCaseName = camelCaseToLoWithSpace(name)
    // const minDate = () => {
    //     let currentDate = moment()
    //     let minDate = currentDate.subtract(65, 'years')
    //     return minDate.format('DD-MM-YYYY')
    // }

    // const maxDate = () => {
    //     let currentDate = moment()
    //     let maxDate = currentDate.subtract(17, 'years')
    //     return maxDate.format('DD-MM-YYYY')   
    // }    

    const [checkBoxError, setCheckBoxError] = useState(null)
    // const errorMessage = useMemo(() => {
    //     switch (checkBoxError) {
    //      case "maxDate": {
    //         return "Registration age cannot be younger than 17"
    //        }
    //      case "minDate": {
    //       return "Registration age unfortunatley cannot be older than 65"
    //      }
    //      case "invalidDate": {
    //       return "Your date is not valid";
    //      }
    //      default: {
    //       return "";
    //      }
    //     }
    //    }, [checkBoxError])

    

    if(type === 'checkbox') checkBox = 1
    
    const [phoneNumber, setPhoneNumber] = useState(defaultValue)
    

    const onPhoneChanged = (val) => {
        console.log({new_phone_number: val})
        onChange(val)
        setPhoneNumber(val)
    }

    // const maxDateObj = dayjs(maxDate())
    // const minDateObj = dayjs(minDate())


    if(id === 'street_number'){
        console.log({Is_Invalid_StreetNumber : invalid})
    }

    return (
        <>
            <section className={`${checkBox === 1 ? 'flex md:w-1/4' : 'w-full md:w-1/2'} lg:justify-center px-3 mb-6 md:mb-0`}>
                <label className={`${checkBox === 1 ? 'flex flex-col md:w-1/4' : 'w-full md:w-1/2'} tracking-wide text-gray-700 text-xs font-bold mb-2`}>
                    <section className='mt-5'>
                    {
                        (type === 'text' || type === 'password' ) ?  //&& type != 'location'
                            <section >
                                {/* ${error && 'border-red-500'}  */}
                            <TextField
                                className='w-full'
                                error={!!error}
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

                            <DatePickerNewUserInput label={name} onChange={onChange} onBlur={onBlur}/>
                            
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
                                    value={value}
                                    name={name} 
                                    type={type}
                                    onChange={onChange}
                                    checked={checked}
                                />
                                    {type === 'checkbox' &&
                                    <section className={`${checkBox === 1 ? 'text-center' : ''}`}>
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
                                    onChange={onChange}
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
                {invalid && type == 'date' &&  <p className="text-red-500 text-xs italic text-center">Selected date cannot be processed</p>}
                {invalid && type == 'tel' &&  <p className="text-red-500 text-xs italic">Please fill in your {lowerCaseName}</p>}
                {(error != undefined && error != '') && <section className="text-red-500 text-xs italic">{error}</section>}
                
                
            </section>
        </>
    )
}
