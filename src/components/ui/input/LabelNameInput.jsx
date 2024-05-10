import { useState, forwardRef } from 'react'
import PhoneInput from 'react-phone-number-input/input'
// import { parsePhoneNumber } from 'react-phone-number-input'

// import PhoneInput from './PhoneInput.jsx'
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
const LabelNameInput = forwardRef(function LabelNameInput({ name, type, ...props }, ref) {

    const [enteredPhoneNumber, setEnteredPhoneNumber] = useState()
    let checkBox = 0

    const lowerCaseName = () => {
        let mutationString = name.toLowerCase();
        return mutationString
    }

    const whiteSpaceBetweenCamelCase = () => {
        // const setWhiteSpaceBetween = name.replace('/[A-Z]/g', "$&/s")
        let res = name.replace(/([A-Z/[a-z]*])/g, "$ ") 
        // console.log({before: name, after: name.replace(/([A-Z])/g, " $& ")  })
        res = name.toLowerCase()
        return res
    }

    // const phoneCheckHandle = (event) => {
    //     event.preventDefault()
        
    //     setEnteredPhoneNumber('0622321564')
    //     return;
    //     // parsePhoneNumber('+12133734253')
    //     // if (phoneNumber) {
    //     //     phoneNumber.country === 'US'
    //     //   }
    // }

    if(type === 'checkbox'){
        checkBox = 1
    }

    return (
        <>
            <section className={`${checkBox === 1 ? 'md:w-1/4' : 'w-full md:w-1/2'}  px-3 mb-6 md:mb-0`}>
                <label className={`${checkBox === 1 ? 'flex flex-col justify-center md:w-1/4' : 'w-full md:w-1/2'}block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2`}>
                    <section className={`${checkBox === 1 ? 'text-center' : ''}`}>
                        {whiteSpaceBetweenCamelCase()}                
                    </section>
                    {
                        type != 'tel' ? 
                            <input 
                            className={`${checkBox === 1 ? '' : 'w-full appearance-none'} block bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} 
                            id={lowerCaseName()}
                            name={lowerCaseName()} 
                            type={type} 
                            ref={ref}
                            {...props}
                            />
                            :
                            <PhoneInput
                                className='w-full appearance-none block bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
                                country="NL"
                                value={enteredPhoneNumber}
                                onChange={setEnteredPhoneNumber} 
                            />
                            // <input 
                            //     type='tel' 
                            //     className='w-full appearance-none block bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
                            // />
                    }
                </label>
                {!checkBox && <p className="text-red-500 text-xs italic">Please fill out this field.</p>}
            </section>
        </>
    )
})

export default LabelNameInput