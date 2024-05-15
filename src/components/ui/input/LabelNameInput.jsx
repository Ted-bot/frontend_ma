import { useState, useEffect } from 'react'

import PhoneInput from 'react-phone-number-input/input'

import {
    GetState,
    GetCity
  } from "react-country-state-city";

/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
export default function LabelNameInput({ name, type, error, ...props }) {
    let checkBox = 0
    const [singleRequest, setSingleRequest] = useState(true)
    const countryid = 156

    const [stateId, setStateId] = useState(0)
    const [selectedStateIndexNr, setSelectedStateIndexNr] = useState(0)
    const [selectedCityIndexNr, setSelectedCityIndexNr] = useState(0)
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])

    const lowerCaseName = () => {
        let mutationString = name.toLowerCase();
        return mutationString
    }

    if(type === 'checkbox'){
        checkBox = 1
    }

    useEffect(() => {
        if(singleRequest){
            setSingleRequest(false)
            GetState(countryid).then((result) => {
                setStateList(result)
            })
        }
    })

    useEffect(() => {
        if(stateId){
            GetCity(countryid,stateId).then((result) => {
                // console.log({stateId: stateId})
                // console.log({getCity: result})
                 setCityList(result)
             })
        }
      }, [stateId])

    return (
        <>
            <section className={`${checkBox === 1 ? 'flex md:w-1/4' : 'w-full md:w-1/2'} lg:justify-center px-3 mb-6 md:mb-0`}>
                <label className={`${checkBox === 1 ? 'flex flex-col md:w-1/4' : 'w-full md:w-1/2'} tracking-wide text-gray-700 text-xs font-bold mb-2`}>
                    <section className={`${checkBox === 1 ? 'text-center' : ''}`}>
                        {name}                
                    </section>
                    {
                        (type != 'tel' && type != 'location') ? 
                            <input 
                                className={`${checkBox === 1 ? 'h-8 w-8 lg:h-12 lg:w-12 accent-orange-300' : 'w-full appearance-none'} ${error && 'border-red-500'} block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} 
                                id={lowerCaseName()}
                                name={lowerCaseName()} 
                                type={type}
                                autoComplete='off'
                                {...props}
                            />
                        : type === 'tel' ?
                            <PhoneInput
                                className={`${error && 'border-red-500'} w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                country="NL"
                                {...props}
                            />
                        :
                        <section className='flex flex-wrap w-full justify-evenly'>
                            <select
                                className={`w-2/5 z-50 ${error && 'border-red-500'} block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}  
                                onChange={(e) => {
                                    const state = stateList[e.target.value]; //here you will get full state object.
                                    // console.log({"selected_State ":state.name})
                                    setStateId(state.id)
                                    setSelectedStateIndexNr(e.target.value)
                                    }
                                }
                                value={selectedStateIndexNr}
                                required
                            >
                                {stateList.map((item, index) => (
                                <option key={index} value={index}>
                                    {item.name}
                                </option>
                                ))}
                            </select>

                            <select
                                className={`w-2/5 z-50 ${error && 'border-red-500'} block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}  
                                onChange={(e) => {
                                    setSelectedCityIndexNr(e.target.value)
                                }}
                                value={selectedCityIndexNr}
                                required
                            >
                                {cityList.map((item, index) => (
                                <option key={index} value={index}>
                                    {item.name}
                                </option>
                                ))}
                            </select>
                        </ section>
                    }
                </label>
                {error && type === 'password' &&  <p className="text-red-500 text-xs italic">Please fill in a {lowerCaseName()} </p>}
                {error && type === 'text' &&  <p className="text-red-500 text-xs italic">Please fill in your {lowerCaseName()} </p>}
                {error && type == 'checkbox' &&  <p className="text-red-500 text-xs italic">Please fill gender</p>}
                {error && type == 'date' &&  <p className="text-red-500 text-xs italic">Sorry, only between the age of 7 and 60 years can sign in!</p>}
                {error && type == 'tel' &&  <p className="text-red-500 text-xs italic">Please fill in your {lowerCaseName()}</p>}
            </section>
        </>
    )
}
