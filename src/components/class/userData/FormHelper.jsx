import React from "react"
import { useErrorBoundary } from "react-error-boundary"

// export const sendToErrorBoundray = (data) => {
//     const {showBoundary} = useErrorBoundary()
//     return showBoundary(data)
// }

export const checkForInvalidInputUser = (enteredInputIsInvalid) => {
    for (const [key, value] of Object.entries(enteredInputIsInvalid)){
        if(value && key !== 'undefined'){
            return {bool: false, invalidField: key}
        }
    }
    return {bool: true, invalidField: null}
}

export function inputBlurHandle(identifier, event, setEnteredInputIsInvalid) {
    const regexSearch = /^[A-Za-z]+$/
    
    if(identifier == 'gender')
        {
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : event ? false : true
            }))
        }        
    
    if(identifier == 'first_name' || identifier == 'last_name')
        {
            console.log({[identifier]: regexSearch.test(event)})
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : regexSearch.test(event) ? false : true
            }))
        }

    if(identifier == 'email')
        {
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : (!event.includes('@') || event == '' || event === null) ? true : false
            }))
        }

    if(identifier == 'date_of_birth' )
        {
            const currentYear = new Date().getFullYear();
            const yearOfBirth = event.split("-")[0]
            const age = currentYear - yearOfBirth

            console.log({ageUser: age > 17})

            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : (age > 17) || (age < 60) ? false : true
            }))
        }
        
    if(identifier == 'password' )
        {
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : (event.length < 6)   ? true : false
            }))
        }

    if(identifier == 'phone_number' || identifier == 'conversion')
        {
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : (event == '') ? true : false
            }))
        }
}


export function errorHandlerPostRequest(error, showErrors){
    
    const ifArrayErrors = error?.body
    if(Array.isArray(ifArrayErrors) && (ifArrayErrors.length > 1))
    {
        console.log('{cameIn: 1}')
        ifArrayErrors.map((error) => {
            showErrors(error.property,error.message)
        })
        return true
        
    } else if(Array.isArray(ifArrayErrors) && (ifArrayErrors?.length === 1) ){
        
        const arrayProperty = ifArrayErrors[0].property
        const messageError = ifArrayErrors[0].message                
        // console.log({property: arrayProperty, message:messageError })
        showErrors(arrayProperty,messageError) 
        return true
        
    } else if (ifArrayErrors?.property instanceof Array) {
        console.log('{cameIn: 3}')
        const arrayProperty = ifArrayErrors.property[0]
        const messageError = ifArrayErrors.message                
        showErrors(arrayProperty,messageError)
        return true
        
    } else {           
        if(ifArrayErrors?.property){
            console.log('{cameIn: 4}')
            const arrayProperty = ifArrayErrors.property
            const messageError = ifArrayErrors.message
            showErrors(arrayProperty,messageError)
            return true
        } else {
            console.error('UnHandled Error', error)
            return false
        }
    }
}