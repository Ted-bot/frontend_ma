const prepRequestFields = {
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    city: '',
    city_id: '',
    city_list_nr:'',
    state:'',
    state_id:'',
    state_list_nr:'',
    date_of_birth: '',
    phone_number: '',
    conversion: '',
}

const inputValidList = {
    gender: false,
    first_name: false,
    last_name: false,
    email: false,
    city: false,
    date_of_birth: false,
    phone_number: false, // returns as snakecase from backend
    conversion: false,
    password: false,
}

export function ApiFetchGetOptions(url,headerOptions = null) {
    return {
        url: url, 
        method: 'GET',
        headers: {
            "Content-Type":"application/json",
            ...headerOptions
        },
    }
}

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

export function setLocalStorageItem(name,data){
    localStorage.setItem(name, JSON.stringify(data))
}

export function getLocalStorageItem(name){

    return localStorage.getItem(name) != null ? JSON.parse(localStorage.getItem(name)) : null
}

export function deleteLocalStorageItem(name){
    localStorage.removeItem(name)
}

export function setToken(data){
    if(localStorage.getItem('auth') != null){
        localStorage.removeItem('auth')
    }
    localStorage.setItem('auth', JSON.stringify(data))
}

export function getToken(){
    return  localStorage.getItem('auth') != null ? JSON.parse(localStorage.getItem('auth')) : null
}

export function deleteToken(){
    localStorage.removeItem("auth")
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
            // key === 'state_id' || 
            // key === 'city_id' ||
            if( key === 'city_list_nr' || key === 'state_list_nr' || key === 'state'){
                continue
            }

            if( key === 'city' ){
                newKey = 'location'
                requiredPostRequestFields[newKey] =  value instanceof String ? value.trim() : value
                continue
            }

            // if( key === 'cityId' ){
            //     newKey = 'location'
            //     requiredPostRequestFields[newKey] = value
            //     continue
            // }

            // if( key === 'state_id' ){
            //     newKey = 'stateId'
            //     requiredPostRequestFields[newKey] = value
            //     continue
            // }
            
            requiredPostRequestFields[key] = value instanceof String ? value.trim() : value

        }

        return requiredPostRequestFields
}

export function findInvalidInput(obj){

    for (const key in obj)
    {
        const value = obj[key]

        const avoid_keys = ["state_id", "paymentMethodName", "paymentMethodId", "country", "countryId", "city_id"]

        if(avoid_keys.includes(key)) continue

        if(value === true) {
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

        // console.log({checIfValueIsSTringOrInt: trimIfString})
        if(key == 'city_id' ||  key == 'state_id' || key == 'city_list_nr' || key == 'state_list_nr' || key == 'state'  || key == 'region' || key == 'unitNumber'){
            console.log({setPrepareRequest_key: key, value: obj[key]})
            //  ||  key == 'state_id' || key == 'city_list_nr' || key == 'state_list_nr' || key == 'state'
            continue
        }
        
        if(Number.isInteger(trimIfString))
        {
            // setLockedSubmitButton(false)
            // console.log({lefOverIfCheck: key})
            setEnteredInputIsInvalid((prevValue) => ({
                ...prevValue,
                [key] : false
            }))
            // return foundInvalid = true
        } else if (trimIfString instanceof String) {
            // setLockedSubmitButton(true)
            setEnteredInputIsInvalid((prevValue) => ({
                ...prevValue,
                [key] : false
            }))
            // console.log({key: obj[key]})
            // return foundInvalid = true
        } else if (!value) {
            setLockedSubmitButton(true)
            setEnteredInputIsInvalid((prevValue) => ({
                ...prevValue,
                [key] : true
            }))
            // console.log({key: obj[key]})
            foundInvalid = true
        }
    }
    
    // setLockedSubmitButton(false)

    return foundInvalid
}

export function getErrorFromRequest(obj, setLockedSubmitButton, setEnteredInputIsInvalid)
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
export function prepareInputForRequest(enteredInput, setEnteredInputIsInvalid, cityId, availableCities, stateId, availableStates, updateState)
{
    let newObj = {}
    for (const [key, value] of Object.entries(enteredInput))
    {
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
    
            updateState(key)
    
            cityName = city.name
        }
    
        if(key == 'stateLocation')
        {
            const state = availableStates.find((state) => state.id == Number(stateId) )
            stateName = state.name
            continue
        }
        // End For Registration

        // FOr Payment

    
        newObj = { ...newObj, [key]: value}
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

export {prepRequestFields, inputValidList}