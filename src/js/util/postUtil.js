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
                requiredPostRequestFields[newKey] = value
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
            
            requiredPostRequestFields[key] = value

        }

        return requiredPostRequestFields
}

export function foundInvalidInputData(obj)
{
    for (const key in obj)
    {
        if(obj[key] === true)
        {
    
            return true
        }
    }
}
    
export function checkIfObjHasEmptyProperties(obj)
{
    let newObj = {}
    for (const key in obj)
        {
            
        if(obj[key] == '')
        {
            newObj[key] = true
        }
        return newObj
    }
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