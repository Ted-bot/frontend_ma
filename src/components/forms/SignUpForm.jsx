import { useState, useEffect } from 'react'
import { useNavigate,
    useNavigation,
    // useLocation 
} from 'react-router-dom'
import SignUpInterface from '../interface/SignUpInterface.jsx'
import { PostError } from '../../js/error/PostError.js'
import { reconstructPostInput,
    ApiFetch,
    ApiFetchPostOptions,
    foundInvalidInputData,
    prepRequestFields,
    inputValidList,
    setLocalStorageItem,
    deleteLocalStorageItem,
    getNewUserObjOrStorageData,
    setToken,
} from '../../js/util/postUtil.js'
import { GetState, GetCity } from "react-country-state-city";

const typeText = 'text'
const typeEmail = 'email'
const typePassword = 'password'
const typePhone = 'tel'
const typeDate = 'date'
const typeCheckBox = 'checkbox'
const typeLocation = 'location'

// ps mace@email.com pw:7k_b3N&8@@*!
// ps reset pw:84N@^7ad8sh
// ps reset pw:TNrh5vrZ4N201n2
// ps reset pw:GivjJD4guFwQhzv

export default function SignUpForm() {

    const countryid = 156
    const regexSearch = /^[A-Za-z]+$/
    const nameStorageItem = 'newuser'

    const navigate = useNavigate()
    const navigation = useNavigation()
    // const locationNav = useLocation()
    
    let isSubmitting = navigation.state === 'submitting'

    const [genderStatusRequired, setGenderStatusRequired] = useState(true)
    const [enteredInput, setEnteredInput] = useState(getNewUserObjOrStorageData(nameStorageItem))
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    
    const [singleRequest, setSingleRequest] = useState(true)
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [errors, setErrors] = useState(prepRequestFields)
    
    useEffect(() => {
        if(singleRequest){
            setSingleRequest(false)
            GetState(countryid).then((result) => {
                setStateList(result)
            })

        }
    }, [singleRequest])
    
    useEffect(() => {
        setLocalStorageItem(nameStorageItem,enteredInput)
    }, [enteredInput])

    function inputHandle(identifier, event){

        if(identifier == 'gender' && event == 'male' || event == 'female')
            {
                genderStatusRequired === true ? setGenderStatusRequired(false) : ''
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : event ? false : true
                }))
            }

        if(identifier == 'state')
            {
                const state = stateList[event.target.value]; //here you will get full state object.
                updateEnteredInputState('state_list_nr', event.target.value)
                updateEnteredInputState('state_id', state.id)       
                updateEnteredInputState(identifier, state.name)
                GetCity(countryid,state.id).then((result) => {
                    setCityList(result)
                })
                return
            }

        if(identifier == 'city')
            {
                const city = cityList[event.target.value]
                updateEnteredInputState(identifier, city.name)
                updateEnteredInputState('city_id', city.id)
                updateEnteredInputState('city_list_nr', event.target.value)
                return
            }
        updateEnteredInputState(identifier, event)
    }

    function inputBlurHandle(identifier, event) {
        if(identifier == 'firstName' || identifier == 'lastName')
            {
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

        if(identifier == 'dateOfBirth' )
            {
                const currentYear = new Date().getFullYear();
                const yearOfBirth = event.split("-")[0]
                const age = currentYear - yearOfBirth

                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : (age < 6) || (age > 60) ? true : false
                }))
            }

        if(identifier == 'password' || identifier == 'phone' || identifier == 'conversion')
            {
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : (event == '') ? true : false
                }))
            }
    }

    function updateEnteredInputState(identifier, value){
        setEnteredInput((prevValues) => {
            return {
                ...prevValues,
                [identifier]: value
            }
        })
    }

    const InterfaceConfiguration = {
        title: 'Sign Up',
        buttonname: 'Register',
        titleTextArea: 'Message',
        descriptionToJoinTextArea: 'What caught your interest to join our training sessions',
        setItems : [
            { name: 'FirstName', id: 'first_name', type: typeText, placeholder: 'first name', value: enteredInput.firstName, error: errors.firstName, invalid: enteredInputIsInvalid.firstName, required:true , onChange: (e) => inputHandle('firstName', e.target.value), onBlur : (e) => inputBlurHandle('firstName', e.target.value)},
            { name: 'LastName', id: 'last_name', type: typeText, placeholder: 'last name', value: enteredInput.lastName, error: errors.lastName, invalid: enteredInputIsInvalid.lastName, required:true , onChange: (e) => inputHandle('lastName', e.target.value), onBlur : (e) => inputBlurHandle('lastName', e.target.value)},
            { name: 'Email', id: 'email', type: typeEmail, placeholder: 'email', value: enteredInput.email, error: errors.email, invalid: enteredInputIsInvalid.email, autoComplete: 'email', required:true, onChange: (e) => inputHandle('email', e.target.value), onBlur : (e) => inputBlurHandle('email', e.target.value)},
            { name: 'Male', id: 'male', type: typeCheckBox, checked: (enteredInput.gender == 'male' ? true : false), value: 'male', required: genderStatusRequired, error: errors.male, onChange: (e) => inputHandle('gender', e.target.value)},
            { name: 'Female', id: 'female', type: typeCheckBox, checked: (enteredInput.gender == 'female' ? true : false), value: 'female', required: genderStatusRequired, error: errors.female, onChange: (e) => inputHandle('gender', e.target.value)},
            { name: 'DateOfBirth', id: 'date_of_birth', type: typeDate, value: enteredInput.dateOfBirth, invalid: enteredInputIsInvalid.dateOfBirth, error: errors.dateOfBirth, required:true, onChange: (e) => inputHandle('dateOfBirth', e.target.value), onBlur : (e) => inputBlurHandle('dateOfBirth', e.target.value)},            
            { name: 'PhoneNumber', id: 'phone_number', type: typePhone, placeholder: 'phone number', value: enteredInput.phoneNumber, error: errors.phoneNumber, invalid: enteredInputIsInvalid.phone, required:true, onChange: (value) => inputHandle('phoneNumber', value), onBlur : (e) => inputBlurHandle('phone', e.target.value)},
            { name: 'Password', id: 'password', type: typePassword, placeholder: 'passord', error: errors.password, autoComplete: 'current-password', required: true, onBlur : (e) => inputBlurHandle('password', e.target.value)},
            { name: 'Location', id: 'location', type: typeLocation, value: enteredInput.city, cityList, stateList, stateId: enteredInput.state_id, error: errors.location, invalid: enteredInputIsInvalid.city, required:true , onChangeState: (e) => inputHandle('state', e), onChangeCity: (e) => inputHandle('city', e), onBlur : (e) => inputBlurHandle('city', e.target.value)},
        ]
    }

    const postRequest = async (data) => {
        try {
            const options = { url: '/api/v2/register', method: 'POST'}
            const ApiOptions = ApiFetchPostOptions(options,data)            
            const response = ApiFetch(ApiOptions)
        
            if(!response.ok)
            { //if(response.status >= 400 && response.status <= 600)
                const errorJson = await response.json()
                throw new PostError('Api Sign up error', errorJson)
            }

            deleteLocalStorageItem(nameStorageItem)
            const reqResults = await response.json()
            setToken(reqResults)
            navigate('/dashboard') 
            // redirect

        } catch (error) {

            if(
                error.response != undefined && 
                error.response != '' &&
                !error.response.errors.error
            )
            {
                error.response.errors instanceof Array &&
                error.response.errors.map((error) => {
                    setErrors((prevValues) => {
                        return {
                            ...prevValues,
                            [error.property] : error.message
                        }
                    })
                })
            } else {

                if(error.response instanceof Object){
                    const arrayProperties = error.response.errors.property[0]
                    const messageError = error.response.errors.message
                    
                    setErrors((prevValues) => {
                        return {
                            ...prevValues,
                            [arrayProperties] : messageError
                        }
                    })
                } else {
                    console.log(error)
                }
            }

        }
    }

    function handleSubmit(event, enteredInput, enteredInputIsInvalid) {
        event.preventDefault()        
        // console.log({redirect: redirect})
        const pw = event.target.password.value
        const requestData = reconstructPostInput(enteredInput, pw)
        foundInvalidInputData(enteredInputIsInvalid)
        postRequest(requestData)
    }

    console.log({state: navigate})
    console.log({submitting: isSubmitting})

    return (
        <>
            <section className="flex flex-col items-center shadow-md bg-slate-100 py-5 rounded-md px-3 sm:mx-4 w-full sm:px-5 sm:w-4/5 md:px-3 md:shadow-xl">

                <h1 className="pt-3 pb-6 text-2xl">{InterfaceConfiguration.title}</h1>

                <form onSubmit={(e) => handleSubmit(e, enteredInput, enteredInputIsInvalid)} name='sign-up' id='sign-up'>

                    <section className="flex flex-wrap -mx-3 mb-6">
                       <SignUpInterface array={InterfaceConfiguration.setItems} />                        
                    </section>

                    <label className="w-full">
                        {InterfaceConfiguration.titleTextArea}
                        <textarea 
                            name="conversion" 
                            rows={4} 
                            cols={40} 
                            className={`${enteredInputIsInvalid.conversion || errors.conversion && 'border border-red-500'} borderwinds rounded px-2 pt-1 w-full`}
                            onChange={(e) => inputHandle('conversion', e.target.value)} 
                            value={enteredInput.conversion} 
                            placeholder={InterfaceConfiguration.descriptionToJoinTextArea}
                            onBlur={(e) => inputBlurHandle('conversion', e.target.value)}
                            required    
                        />
                    </label>
                    { enteredInputIsInvalid.conversion && <p className="text-red-500 text-xs italic">Please fill Message!</p> }
                    {enteredInput.conversion && <p className="text-red-500 text-xs italic">
                        {errors.conversion}
                    </p>}
                    {enteredInput.conversion.error}

                    <button 
                        className="w-full py-3 mt-10 bg-[#063970] rounded-md
                        font-medium text-white uppercase
                        focus:outline-none hover:shadow-none"
                        disabled={isSubmitting}
                    >
                        {isSubmitting  ? 'Submitting...' : InterfaceConfiguration.buttonname}
                    </button>

                    <section className="flex justify-center pt-6 pb-4">
                        <p><a>Already have a account? Sign in here!</a></p>
                    </section>
                </form>
            </section>
        </>
    )
}