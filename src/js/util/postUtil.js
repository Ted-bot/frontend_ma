import {  prepRequestFields } from "./auth"


export function ApiFetchPostOptions(defineRequest = {url : '', method : 'POST'}, data, headerOptions = null) {
    return {
       url: defineRequest.url, 
       method: defineRequest.method,
       headers: {
           "Content-Type":"application/json",
           ...headerOptions
       },
       body: JSON.stringify(data)
   }
}

export async function ApiFetch(data){
    
    const url = data.url
    delete data.url
    const res = await fetch(url, data)

    return res
}

export function getNewUserObjOrStorageData(name){
    const storedValues = localStorage.getItem(name)

    if(!storedValues){
        return prepRequestFields
    }

    return JSON.parse(storedValues) 
}

export function reconstructPostInput(data, pw)
{        
        let requiredPostRequestFields = {
            password: pw
        }

        for (const [key, value] of Object.entries(data)) {
            let newKey

            if( key === 'state'){
                continue
            }

            if( key === 'city' ){
                newKey = 'location'
                requiredPostRequestFields[newKey] =  value instanceof String ? value.trim() : value
                continue
            }
            
            requiredPostRequestFields[key] = value instanceof String ? value.trim() : value

        }

        return requiredPostRequestFields
}

export function findInvalidInput(obj){

    for (const key in obj)
    {
        const value = obj[key]

        const avoid_keys = ["paymentMethodName","paymentMethodId", "country", "countryId", "location", "state_id", "state", "unitNumber"]

        if(avoid_keys.includes(key)) continue

        if(value) {
            console.log({key: key, findInvalidINput: value})
            return true
        }
    }

    return false
}

export function findAndUpdateInvalidList(obj, setLockedSubmitButton, setEnteredInputIsInvalid)
{
    let foundInvalid = false

    for (const key in obj)
    {
        let value = obj[key]

        const trimIfString = value instanceof String ? value.trim() : value

        // 'city_list_nr' && state_list_nr
        const avoid_keys = ["city_id", "region", "state_id", "state","city_id","unitNumber"]
        if(avoid_keys.includes(key)) continue
        
        if(Number.isInteger(trimIfString))
        {
            setEnteredInputIsInvalid((prevValue) => ({
                ...prevValue,
                [key] : false
            }))
        } else if (trimIfString instanceof String) {
            setEnteredInputIsInvalid((prevValue) => ({
                ...prevValue,
                [key] : false
            }))
        } else if (!value) {
            setLockedSubmitButton(true)
            setEnteredInputIsInvalid((prevValue) => ({
                ...prevValue,
                [key] : true
            }))
            
            foundInvalid = true
        }
    }
    
    // setLockedSubmitButton(false)

    return foundInvalid
}

export function getErrorFromPostRequest(obj, setLockedSubmitButton, setEnteredInputIsInvalid)
{
    let foundInvalid = false

    for (const key in obj)
    {
        let value = obj[key]
        console.log({key_getErrorAfterRequest: key, value: obj[key]})

        const trimIfString = value instanceof String ? value.trim() : true

        console.log({checIfValueIsSTringOrInt: trimIfString, key})
        
        if(trimIfString)
        {
            setLockedSubmitButton(true)
            setEnteredInputIsInvalid((prevValue) => ({
                ...prevValue,
                [key] : true
            }))
            // console.log({key: obj[key]})
            return foundInvalid = true
        } 
    }

    setLockedSubmitButton(false)
    return foundInvalid

}   

    
export function setInputInvalidTrueWhenEnteredInputEmpty(enteredInput, setEnteredInputIsInvalid)
{
    let invalidInput = false
    for (const key in enteredInput)
        {            
            if(key == 'city_id'){
                console.log({setInvalidTrue_key: key, value: enteredInput[key]})
                //  ||  key == 'state_id' || key == 'city_list_nr' || key == 'state_list_nr' || key == 'state'
                continue
            }
            // identifier = enteredInput[key]
            if(enteredInput[key] == '')
                {
                    if(!invalidInput){
                        invalidInput = true
                    }
                    
                    setEnteredInputIsInvalid((prevValue) => ({
                        ...prevValue,
                        [key] : true
                    }))
                }
            }
            
    console.log({foundInvalidInput: invalidInput})
    
    // return invalidInput
}


// change function name
export function prepareInputForRequest(enteredInput, setEnteredInputIsInvalid, cityId, availableCities, stateId, availableStates)
{
    let newObj = {}
    for (const [key, value] of Object.entries(enteredInput))
    {
        let newValue = value
        
        if(key === 'location'){
            const city = availableCities.find((city) => city.id == Number(cityId) )
            //if city not found ?? set invalid input field
            if(value == '' || value == undefined){
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [key] : true})
                )
                return
            }
    
            cityName = city.name
            newValue = cityName
        }

        const avoid_keys = ["id","country", "country", "countryId", "paymentMethodId", "state_id", "state", "unitNumber", "city_id", "paymentMethodName"]

        if(avoid_keys.includes(key)) continue

        newObj = { ...newObj, [key]: newValue}
    }    

    return newObj
}

export function CamelCaseToSnakeCase(string)
{ // the whole string (^[A-Z][a-z]+[A-Z][a-z]+), not finished
    return string.replace(/(^[A-Z][a-z]+[A-Z][a-z]+)/g, "$&_")
}

export function camelCaseToLoWithSpace(data)
{
    const firstName = 'FirstName'
    const lastName = 'LastName'
    const dateOfBirth = 'DateOfBirth'
    const male = 'Male'
    const female = 'Female'
    const phone = 'PhoneNumber'
    const city = 'City'
            
    let newKey = ''

    switch (data){
        case firstName:
            newKey = 'first name'
            break
        case lastName:
            newKey = 'last name'
            break
        case dateOfBirth:
            newKey = 'date of birth'
            break
        case male || female :
            newKey = 'gender'
            break
        case phone :
            newKey = 'phone number'
            break
        case city :
            newKey = 'location'
            break
        default:
            newKey = data
    }
    return newKey
}
