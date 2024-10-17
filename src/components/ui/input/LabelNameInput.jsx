import PhoneInput from 'react-phone-number-input/input'
import NativeSelect from '@mui/material/NativeSelect'
import { camelCaseToLoWithSpace } from '../../../js/util/postUtil'

import { useEffect } from 'react'
import LocationInput from './LocationInput'

/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
export default function LabelNameInput({ 
    id,
    name, 
    type, 
    error,
    invalid,
    cityId,
    cityList, 
    stateId,
    stateList,
    onChangeState,
    onChangeCity,
    ...props 
}) {
    let checkBox = 0    
    const lowerCaseName = camelCaseToLoWithSpace(name)

    if(type === 'checkbox'){
        checkBox = 1
    }


    return (
        <>
            <section className={`${checkBox === 1 ? 'flex md:w-1/4' : 'w-full md:w-1/2'} lg:justify-center px-3 mb-6 md:mb-0`}>
                <label className={`${checkBox === 1 ? 'flex flex-col md:w-1/4' : 'w-full md:w-1/2'} tracking-wide text-gray-700 text-xs font-bold mb-2`}>
                    <section className={`${checkBox === 1 ? 'text-center' : ''}`}>
                        {name}                
                    </section>
                    {
                        (type != 'tel' && type != 'location') ? 
                            <section>

                            <input
                                className={`${checkBox === 1 ? 'h-8 w-8 lg:h-8 lg:w-12 accent-orange-300' : 'w-full appearance-none'} 
                                ${error && 'border-red-500'} 
                                block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} 
                                id={id}
                                name={name} 
                                type={type}
                                {...props}
                                />
                                {invalid && type == 'checkbox' &&  <p className="text-red-500 text-xs italic"> Select gender</p>}
                            </section>
                        : type === 'tel' ?
                            <PhoneInput
                                id={id}
                                className={`${error && 'border-red-500'} 
                                w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight 
                                focus:outline-none focus:bg-white`}
                                country="NL"
                                {...props}
                            />
                        :
                        <>
                            <section className='flex w-full justify-evenly'>
                                <LocationInput 
                                    id={id}
                                    stateId={stateId} 
                                    cityId={cityId} 
                                    errorMessage={error} 
                                    onChangeCity={onChangeCity} 
                                    onChangeState={onChangeState}
                                />
                            </ section> 
                        </>
                    }
                </label>
                {invalid && type == 'password' &&  <p className="text-red-500 text-xs italic">Please fill in a {lowerCaseName} </p>}
                {invalid && type == 'location' &&  <p className="text-red-500 text-xs italic">Please fill in a {lowerCaseName} </p>}
                {invalid && type == 'text' &&  <p className="text-red-500 text-xs italic">Please fill in your {lowerCaseName} </p>}
                {invalid && type == 'date' &&  <p className="text-red-500 text-xs italic">Sorry, only between the age of 7 and 60 years can sign in!</p>}
                {invalid && type == 'tel' &&  <p className="text-red-500 text-xs italic">Please fill in your {lowerCaseName}</p>}
                {(error != undefined && error != '') && <section className="text-red-500 text-xs italic">{error}</section>}
            </section>
        </>
    )
}
