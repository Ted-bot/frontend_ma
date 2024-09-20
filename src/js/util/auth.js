export function getAuthToken(){
    return  localStorage.getItem('auth') != null ? JSON.parse(localStorage.getItem('auth')) : null
    // const token = JSON.parse(localStorage.getItem('auth'))
    // return token
}


export function setAuthToken(data){
    if(getAuthToken() != null){
        deleteAuthToken()
    }
    localStorage.setItem('auth', JSON.stringify(data))
    // localStorage.setItem('auth', JSON.stringify(data))
    // return token
}

export function deleteAuthToken(){
    localStorage.removeItem('auth')
}

export function tokenLoader() {
    return getAuthToken()
}


/* 
|| 
- - >  Start: Register Page
|| 
*/

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

/* 
|| 
- - >  End: Register Page
|| 
*/


/* 
|| 
- - >  Start: Order Payment Page
|| 
*/
const countryid = 156

const prepPaymentRequestFields = {
    firstAndLastName:'',
    email:'',
    phoneNumber:'',
    unitNumber: '',
    streetNumber: '',
    addressLine: '',
    city: '',
    region: '',
    postalCode: '',
    state:'',
    city_id:'',
    state_id:'',
    paymentMethodName:'no payment method selected!',
    paymentMethodId:'',
    countryId: countryid
}

const inputPaymentValidList = {
    firstAndLastName: false,
    email: false,
    phoneNumber: false,
    streetNumber: false,
    // unitNumber: false,
    addressLine: false,
    city: false,
    region: false,
    postalCode: false,
    state: false,
    city: false,
    paymentMethodId: false,
}

/* 
|| 
- - >  End: Order Payment Page
|| 
*/

export {countryid, prepPaymentRequestFields, inputPaymentValidList, prepRequestFields, inputValidList}