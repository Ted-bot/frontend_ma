const prepRequestFields = {
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    city: '',
    city_id: '',
    city_list_nr:'',
    state:'',
    state_id:'',
    state_list_nr:'',
    dateOfBirth: '',
    phoneNumber: '',
    conversion: '',
}

const inputValidList = {
    gender: false,
    firstName: false,
    lastName: false,
    email: false,
    city: false,
    dateOfBirth: false,
    phone: false,
    conversion: false,
    password: false,
}

export function reconstructPostInput(data, pw)
{        
        let requiredPostRequestFields = {
            password: pw
        }

        for (const [key, value] of Object.entries(data)) {
            let newKey
            if( key === 'city_id' || key === 'city_list_nr' || key === 'state_id' || key === 'state_list_nr' || key === 'state'){
                continue
            }

            if( key === 'city' ){
                newKey = 'location'
                requiredPostRequestFields[newKey] = value
                continue
            }
            
            requiredPostRequestFields[key] = value

        }

        return requiredPostRequestFields
}

export function foundInvalidInputData(dataIsInvalid)
{
    for (const key in dataIsInvalid)
    {
        if(dataIsInvalid[key] === true)
        {
            return true
        }
    }
}

export function CamelCaseToSnakeCase(string)
{ // the whole string (^[A-Z][a-z]+[A-Z][a-z]+), not finished
    return string.replace(/(^[A-Z][a-z]+[A-Z][a-z]+)/g, "$&_")
}

export function camelCaseToLoWithSpace(data)
{
    console.log(data)
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