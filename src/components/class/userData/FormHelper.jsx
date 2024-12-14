import { GetState } from "react-country-state-city/dist/cjs"
import { countryid } from "../../../js/util/auth"
import { isObject } from "@mui/x-data-grid/internals"

export const getStates = async () => {return await GetState(countryid)}

export const noInvalidInputUserFound = (enteredInputIsInvalid) => {
    for (const [key, value] of Object.entries(enteredInputIsInvalid)){
        if(!value && key && key != 'undefined'){
            return {bool: false, invalidField: key}
        }
    }
    return {bool: true, invalidField: null}
}


export const noInvalidFieldDetected = (enteredInputIsInvalid) => {
    for (const [key, value] of Object.entries(enteredInputIsInvalid)){
        if(value && key && key != 'undefined'){
            return {bool: false, invalidField: key}
        }
    }
    return {bool: true, invalidField: null}
}

const passwordCheckAtleastTwoSpecialChar = /^(?=(?:[^A-Za-z/\d\n]*[A-Za-z\d]){2})[A-Za-z\d]*[~!@#$%^&*()_+<>•`{}\\][~!@#$%^&*()_+<>•`{}\\A-Za-z\d]*$/
const passwordCheckAtleastTwoUpperCaseChar = /^(?=(?:.*[A-Z]){2})/

export const isPasswordValid = (value) => {
    if(value.length < 6){
        return true
    } else if (value.length > 40){
        return true
    } 
    else if (!passwordCheckAtleastTwoUpperCaseChar.test(value)){
        return true
    }
    else if (!passwordCheckAtleastTwoSpecialChar.test(value)){
        return true
    } 
    return false
}

export const PasswordIsInvalidMessage = ({value}) => {
    console.log("is password check working", passwordCheckAtleastTwoUpperCaseChar.test(String(value)))
    if(value && String(value).length < 6){
        return "you password can not be lower than 6 characters"
    } else if (value && String(value).length > 40){
        return "you password can not be more than 40 characters"
    } 
    else if (!passwordCheckAtleastTwoUpperCaseChar.test(value)){
        return "you password should have at least two upper case characters e.g. 'A A'"
    } 
    else if (!passwordCheckAtleastTwoSpecialChar.test(value)){
        return "you password should have at least two special characters e.g. '~!@#$%^&*()_+<>•`{}\'"
    }
    return "you must set a strong password to signup"
}

export function inputBlurHandle(identifier, event, setEnteredInputIsInvalid) {
    const regexSearch = /^[A-Za-z]+$/
    
    if(!identifier){
        console.log({undefined_identifier_found: event})
        return
    }
    
    if(identifier === 'gender')
        {
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : event ? false : true
            }))
            return
        }        
    
    if(identifier === 'first_name' || identifier == 'last_name')
        {
            console.log({[identifier]: regexSearch.test(event)})
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : regexSearch.test(event) ? false : true
            }))
            return
        }

    if(identifier === 'email')
        {
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : (!event.includes('@') || event == '' || event === null) ? true : false
            }))
            return
        }

    if(identifier === 'date_of_birth' )
        {
            // const currentYear = new Date().getFullYear();
            // const yearOfBirth = event.split("-")[0]
            // const age = currentYear - yearOfBirth

            // console.log({ageUser: age > 17})

            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : !!event
            }))
            return
        }
        
    if(identifier === 'password' )
        {
            console.log({testPassword: passwordCheckAtleastTwoSpecialChar.test(event)})
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                // [identifier] : (event.length < 6)  ? true : false
                [identifier] : isPasswordValid(event) ? true : false
            }))
            return
        }

    if(identifier === 'phone_number')
        {
            const tel = event
            const cleanNumber = tel.replace(/ +/g, "")
            
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : (cleanNumber.length >= 16) ? true : (cleanNumber.length <= 12) ? true : false
            }))
            return
        }  

    if( identifier == 'conversion') // identifier === 'phone_number' ||
        {
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : (event == '') ? true : false
            }))
            return
        }

    if(identifier != 'unit_number'){
        setEnteredInputIsInvalid((prevValues) => ({
            ...prevValues,
            [identifier] : (event === '') ? true : false
        }))
    }        
}

export function errorPayloadHandler(error, showErrors){
    
    if(error.errors){
        for(const [key,value] of Object.entries(error.errors)){
            let itemKey = key
            console.log('Error Key',itemKey)
            console.log('Error Value',value)
            if(key === 'city') itemKey = 'city_id'
            showErrors([itemKey], value)
        }
        return true
    } else {
        return false
    }
}


export function errorHandlerPostRequest(error, showErrors){
    const ifArrayErrors = error?.body
    console.log("Got error body", error)
    if(Array.isArray(ifArrayErrors) && (ifArrayErrors.length > 1))
    {
        console.log('{cameIn: 1}', ifArrayErrors)
        ifArrayErrors.map((error) => {
            // console.log({ShowSingleErrorProp: error.property,ShowSingleErrorMessage :error.message})
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
        console.log('{cameIn: 3}', ifArrayErrors)
        const arrayProperty = ifArrayErrors.property[0]
        const messageError = ifArrayErrors.message                
        showErrors(arrayProperty,messageError)
        return true
        
    } else {           
        if(ifArrayErrors?.property){
            console.log('{cameIn: 4}', ifArrayErrors)
            const arrayProperty = ifArrayErrors.property
            const messageError = ifArrayErrors.message
            showErrors(arrayProperty,messageError)
            return true
        } else if(typeof ifArrayErrors === 'string') {
            //can only be email on signUp page
            if(ifArrayErrors.includes('SQLSTATE[23505]')) //code for Unique violation: 7 ERROR:  duplicate key
            {
                showErrors('email','email already exist')
            } else {
                // note: set logger // send error somewhere to verify issue !important
                showErrors('password','Unknown error')
            }
            return true
        } else {
            console.error('UnHandled Error', error)
            return false
        }
    }
}

export function errorHandlerPaymentUserAddressRequest(error, showErrors){
    const ifArrayErrors = error?.body ?? error?.errors
    console.log("what you got", error, !isObject(ifArrayErrors))

    if(!isObject(ifArrayErrors) === true && !Array.isArray(ifArrayErrors)) return false

    const countErrors = Object.keys(ifArrayErrors).map((key) => [key, ifArrayErrors[key]])
    // console.log("Got error body", error)
    console.log("Got error body", countErrors.length)
    if(isObject(ifArrayErrors))
        {
            console.log('{cameIn: 0}', ifArrayErrors)
    
            for (const [key, value] of Object.entries(ifArrayErrors)){
                // console.log("Got data kankerzooi", {key,value})
                showErrors(key,value)
            }
            return true
            
    } else if(Array.isArray(ifArrayErrors) && (countErrors.length > 1))
    {
        console.log('{cameIn: 1}', ifArrayErrors)

        for (const [key, value] of Object.entries(ifArrayErrors)){
            // console.log("Got data kankerzooi", {key,value})
            showErrors(key,value)
        }
        return true
        
    } else if(countErrors?.length === 1){

        console.log('{cameIn: 2}', ifArrayErrors)

        for (const [key, value] of Object.entries(ifArrayErrors)){
            showErrors(key,value) 
        }
        return true
    } else {     
        console.error('UnHandled Error', error)
        return false
    }
}