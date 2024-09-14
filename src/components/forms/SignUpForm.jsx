import { useState, useEffect } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom'
import CreateFormInterface from '../interface/CreateFormInterface.jsx'
// import { PostError } from '../../js/error/PostError.js'

import { reconstructPostInput,
    ApiFetch,
    ApiFetchPostOptions,
    findAndUpdateInvalidList,
    setInputInvalidTrueWhenEnteredInputEmpty,
    getNewUserObjOrStorageData,
    getErrorFromPostRequest,
} from '../../js/util/postUtil.js'

import { inputValidList, countryid } from '../../js/util/auth.js'

import {setLocalStorageItem, deleteLocalStorageItem } from "../../js/util/getUtil.js"
import { setAuthToken} from "../../js/util/auth.js"

import { GetState, GetCity } from "react-country-state-city"

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

    const regexSearch = /^[A-Za-z]+$/
    const nameStorageItem = 'new_user'

    const navigate = useNavigate()
    const navigation = useNavigation()
    const [lockedSubmitButton, setLockedSubmitButton] = useState(false)
    
    let isSubmitting = navigation.state === 'submitting'

    const [genderStatusRequired, setGenderStatusRequired] = useState(true)
    const [enteredInput, setEnteredInput] = useState(getNewUserObjOrStorageData(nameStorageItem))
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    
    const [singleRequest, setSingleRequest] = useState(true)
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [errors, setErrors] = useState(inputValidList)
    
    useEffect(() => {
        if(singleRequest){
            setSingleRequest(false)
            GetState(countryid).then((result) => {
                setStateList(result)
            })
        } else {
            setLocalStorageItem(nameStorageItem,enteredInput)
        }
    }, [singleRequest, enteredInput])
    
    useEffect(() => {
        getErrorFromPostRequest(errors,setLockedSubmitButton,setEnteredInputIsInvalid)
    }, [errors])

    const inputHandle = (identifier, event) => {

        if(lockedSubmitButton)
        {
            setErrors(inputValidList)
            setEnteredInputIsInvalid(inputValidList)
            setLockedSubmitButton(false)
        }

        if(identifier == 'password')
        {
            const passwordNotEmpty = event != "" ? true : false
            updateEnteredInputState(identifier, passwordNotEmpty)
            return
        }

        if(identifier == 'gender' && event == 'male' || event == 'female')
        {
            // genderStatusRequired: keep it ternary to allow one to selected
            genderStatusRequired === true ? setGenderStatusRequired(false) : ''
            const genderSelected = event ? false : true

            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : event ? false : true
            }))
            updateEnteredInputState(identifier, genderSelected)
        }

        if(identifier == 'state')
        {
            console.log({stateEvent: event, identifier})
            const state = stateList.find((state) => state.id == Number(event));
            // const state = stateList[event]; //here you will get full state object.
            console.log({state})
            updateEnteredInputState('state_list_nr', event)
            updateEnteredInputState('state_id', state.id)       
            updateEnteredInputState(identifier, state.name)
            GetCity(countryid,state.id).then((result) => {
                setCityList(result)
            })
            return
        }

        if(identifier == 'city')
        {
            const city = cityList.find((city) => city.id == Number(event))
            updateEnteredInputState(identifier, city.name)
            // updateEnteredInputState('city_list_nr', event)
            updateEnteredInputState('city_id', city.id)
            return
        }
        updateEnteredInputState(identifier, event)
    }

    function inputBlurHandle(identifier, event) {

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

                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : (age < 6) || (age > 60) ? true : false
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
            { name: 'FirstName', id: 'first_name', type: typeText, placeholder: 'first name', value: enteredInput.first_name, error: errors.first_name, invalid: enteredInputIsInvalid.first_name, required:true , onChange: (e) => inputHandle('first_name', e.target.value), onBlur : (e) => inputBlurHandle('first_name', e.target.value)},
            { name: 'LastName', id: 'last_name', type: typeText, placeholder: 'last name', value: enteredInput.last_name, error: errors.last_name, invalid: enteredInputIsInvalid.last_name, required:true , onChange: (e) => inputHandle('last_name', e.target.value), onBlur : (e) => inputBlurHandle('last_name', e.target.value)},
            { name: 'Email', id: 'email', type: typeEmail, placeholder: 'email', value: enteredInput.email, error: errors.email, invalid: enteredInputIsInvalid.email, autoComplete: 'email', required:true, onChange: (e) => inputHandle('email', e.target.value), onBlur : (e) => inputBlurHandle('email', e.target.value)},
            { name: 'Male', id: 'male', type: typeCheckBox, checked: (enteredInput.gender == 'male' ? true : false), value: 'male', required: genderStatusRequired, error: errors.gender, onChange: (e) => inputHandle('gender', e.target.value)},
            { name: 'Female', id: 'female', type: typeCheckBox, checked: (enteredInput.gender == 'female' ? true : false), value: 'female', required: genderStatusRequired, error: errors.gender, onChange: (e) => inputHandle('gender', e.target.value)},
            { name: 'DateOfBirth', id: 'date_of_birth', type: typeDate, value: enteredInput.date_of_birth, invalid: enteredInputIsInvalid.date_of_birth, error: errors.date_of_birth, required:true, onChange: (e) => inputHandle('date_of_birth', e.target.value), onBlur : (e) => inputBlurHandle('date_of_birth', e.target.value)},            
            { name: 'PhoneNumber', id: 'phone_number', type: typePhone, placeholder: 'phone number', value: enteredInput.phone_number, error: errors.phone_number, invalid: enteredInputIsInvalid.phone_number, required:true, onChange: (value) => inputHandle('phone_number', value), onBlur : (e) => inputBlurHandle('phone_number', e.target.value)},
            { name: 'Password', id: 'password', type: typePassword, placeholder: 'passord', error: errors.password, invalid: enteredInputIsInvalid.password,autoComplete: 'current-password', required: true, onChange: (e) => inputHandle('password', e.target.value), onBlur : (e) => inputBlurHandle('password', e.target.value)},
            { name: 'Location', id: 'location', type: typeLocation, value: enteredInput.city, cityList, stateList, cityId: enteredInput.city_id, stateId: enteredInput.state_id, error: errors.location, invalid: enteredInputIsInvalid.city,
                required:true , onChangeState: (e) => inputHandle('state', e.target.value), onChangeCity: (e) => inputHandle('city', e.target.value), onBlur : (e) => inputBlurHandle('city', e.target.value)},
        ]
    }

    const postRequest = async (data) => {
        
        const options = { url: '/api/v2/register', method: 'POST'}
        const ApiOptions = ApiFetchPostOptions(options,data)            

        try {
            const response = await ApiFetch(ApiOptions)
            const getResults = await response.json()
        
            if(!response.ok)
            { //if(response.status >= 400 && response.status <= 600)
                // throw {error: getResults.error, property: getResults.property, message: getResults.message, sql_state: getResults.sql_state}
                throw {errors: getResults.errors}
            }

            setErrors(inputValidList)            
            deleteLocalStorageItem(nameStorageItem)
            setAuthToken(getResults.token)
            navigate('/dashboard', {replace: true})
            
        } catch (error) {

            if(
                Array.isArray(error.errors) && (error.errors.length > 1)
            )
            {
                console.log({entere_with_multiple_errors: error.errors})
                error.errors.map((error) => {
                    setErrors((prevValues) => {
                        return {
                            ...prevValues,
                            [error.property] : error.message
                        }
                    })
                })


            } else if(Array.isArray(error.errors) && (error.errors.length == 1) ){

                    const arrayProperties = error.errors[0].property
                    const messageError = error.errors[0].message
                    
                    setErrors(() => {
                        return {
                            [arrayProperties] : messageError
                        }
                    })
                    
                } else {
                    
                    if(error.errors?.property instanceof Array){
                        const arrayProperties = error.errors.property[0]
                        const messageError = error.errors.message
                        
                        setErrors(() => {
                            return {
                                [arrayProperties] : messageError
                            }
                        })
                }
                console.log({unHandledError: error})
            }
        }
    }

    function handleSubmit(event, enteredInput, setEnteredInputIsInvalid) {
        event.preventDefault()        
        delete enteredInput.password
        
        const pw = event.target.password.value
        const requestData = reconstructPostInput(enteredInput, pw)
        const checkInputUser = findAndUpdateInvalidList(enteredInput, setLockedSubmitButton, setEnteredInputIsInvalid) 
        
        if(!checkInputUser){
            postRequest(requestData)

        } else {
            setInputInvalidTrueWhenEnteredInputEmpty(enteredInput, setEnteredInputIsInvalid)
        }
    }

    return (
        <>
            <section className="flex flex-col items-center shadow-md bg-slate-100 py-5 rounded-md px-3 sm:mx-4 w-full sm:px-5 sm:w-4/5 md:px-3 md:shadow-xl">

                <h1 className="pt-3 pb-6 text-2xl">{InterfaceConfiguration.title}</h1>

                <form onSubmit={(e) => handleSubmit(e, enteredInput, setEnteredInputIsInvalid)} name='sign-up' id='sign-up'>

                    <section className="flex flex-wrap -mx-3 mb-6">
                       <CreateFormInterface array={InterfaceConfiguration.setItems} />                        
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

                    <button 
                        className={`${lockedSubmitButton && 'opacity-50'} ${!lockedSubmitButton && 'hover:bg-[#686c6f] '} w-full py-3 mt-10 bg-[#063070] rounded-md
                        font-medium text-white uppercase focus:outline-none hover:shadow-none `}
                        disabled={isSubmitting || lockedSubmitButton}
                    >
                        {isSubmitting ? 'Submitting...' : InterfaceConfiguration.buttonname}
                    </button>

                    <section className="flex justify-center pt-6 pb-4">
                        <p><a>Already have a account? Sign in here!</a></p>
                    </section>
                </form>
            </section>
        </>
    )
}