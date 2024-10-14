import { useState, useEffect } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom'
import CreateFormInterface from '../interface/CreateFormInterface.jsx'

import { 
    reconstructPostInput,
    ApiFetch,
    ApiFetchPostOptions,
    getNewUserObjOrStorageData,
} from '../../js/util/postUtil.js'

import { inputValidList, countryid } from '../../js/util/auth.js'

import {setLocalStorageItem, deleteLocalStorageItem, getLocalStorageItem } from "../../js/util/getUtil.js"

import { GetCity } from "react-country-state-city"
import { useErrorBoundary } from "react-error-boundary"
import { inputBlurHandle, checkForInvalidInputUser } from '../class/userData/FormHelper.jsx'
import { useUserFormContext } from '../../store/user-form-context.jsx'
import { HttpError } from 'react-admin'
import { errorHandlerPostRequest } from '../class/userData/FormHelper.jsx'

const typeText = 'text'
const typePassword = 'password'
const typePhone = 'tel'
const typeDate = 'date'
const typeCheckBox = 'checkbox'
const typeLocation = 'location'

// ps mace@email.com pw:7k_b3N&8@@*!
// ps reset pw:84N@^7ad8sh
// ps reset pw:TNrh5vrZ4N201n2
// ps reset pw:GivjJD4guFwQhzv

export default function SignUpForm({stateList, nameStorageItem, userStoredFormData}) {

    const navigate = useNavigate()
    const navigation = useNavigation()
    const {showBoundary} = useErrorBoundary()
    const {state, dispatch} = useUserFormContext()
    
    let isSubmitting = navigation.state === 'submitting'
    
    const [genderStatusRequired, setGenderStatusRequired] = useState(true)
    const [enteredInput, setEnteredInput] = useState(getNewUserObjOrStorageData(nameStorageItem))
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    const [cityList, setCityList] = useState([])
    const [firstRequest, setFirstRequest] = useState(true)
    const [errors, setErrors] = useState(inputValidList)
    
    useEffect(() => {
        if(firstRequest){
            setEnteredInput(userStoredFormData)
            setFirstRequest(false)
        }
        setLocalStorageItem(nameStorageItem,enteredInput)
    }, [enteredInput])
    

    const handleGeneralUserInput = (identifier, value) => {
        setEnteredInput((prevValues) => ({
            ...prevValues,
            [identifier]: value
        }))
        const updateUserForm = {[identifier]: value}
        dispatch({type: 'SET_GENERAL_USER_DATA', payload: updateUserForm})
    }
    
    const handleGenderUserInput = (identifier, value) => {
        if(identifier != 'gender') return            
        if(value != 'male' && value != 'female') return
        
        // genderStatusRequired: keep it ternary to allow one of the two boxes to selected
        genderStatusRequired === true ? setGenderStatusRequired(false) : ''

        setEnteredInputIsInvalid((prevValues) => ({
            ...prevValues,
            [identifier] : value ? false : true
        }))
        handleGeneralUserInput(identifier, value)
    }

    const handleCitylUserInput = (identifier, value) => {
        const city = cityList.find((city) => city.id == Number(value))
        handleGeneralUserInput(identifier, city.name)
        handleGeneralUserInput('city_id', city.id)
    }
    
    const handleStatelUserInput = (identifier, value) => {
        console.log({stateEvent: value, identifier})
        const state = stateList.find((state) => state.id == Number(value))          
        handleGeneralUserInput('state_id', state.id)        
        handleGeneralUserInput(identifier, state.name)
        GetCity(countryid,state.id).then((result) => { setCityList(result) })
    }

    const InterfaceConfiguration = {
        title: 'Sign Up',
        buttonname: 'Register',
        titleTextArea: 'Message',
        descriptionToJoinTextArea: 'What caught your interest to join our organisation',
        setItems : [
            { name: 'FirstName', id: 'first_name', type: typeText, placeholder: 'first name', value: enteredInput?.first_name, error: errors.first_name, invalid: enteredInputIsInvalid.first_name, required:true , onChange: (e) => handleGeneralUserInput('first_name', e.target.value), onBlur : (e) => inputBlurHandle('first_name', e.target.value, setEnteredInputIsInvalid)},
            { name: 'LastName', id: 'last_name', type: typeText, placeholder: 'last name', value: enteredInput?.last_name, error: errors.last_name, invalid: enteredInputIsInvalid.last_name, required:true , onChange: (e) => handleGeneralUserInput('last_name', e.target.value), onBlur : (e) => inputBlurHandle('last_name', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Email', id: 'email', type: typeText, placeholder: 'email', value: enteredInput?.email, error: errors.email, invalid: enteredInputIsInvalid.email, autoComplete: 'email', required:true, onChange: (e) => handleGeneralUserInput('email', e.target.value), onBlur : (e) => inputBlurHandle('email', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Male', id: 'male', type: typeCheckBox, checked: (enteredInput?.gender == 'male' ? true : false), value: 'male',invalid: enteredInputIsInvalid.gender, required: genderStatusRequired, error: errors.gender, onChange: (e) => handleGenderUserInput('gender', e.target.value)},
            { name: 'Female', id: 'female', type: typeCheckBox, checked: (enteredInput?.gender == 'female' ? true : false), value: 'female',invalid: enteredInputIsInvalid.gender, required: genderStatusRequired, error: errors.gender, onChange: (e) => handleGenderUserInput('gender', e.target.value)},
            { name: 'DateOfBirth', id: 'date_of_birth', type: typeDate, value: enteredInput?.date_of_birth, invalid: enteredInputIsInvalid.date_of_birth, error: errors.date_of_birth, required:true, onChange: (e) => handleGeneralUserInput('date_of_birth', e.target.value), onBlur : (e) => inputBlurHandle('date_of_birth', e.target.value, setEnteredInputIsInvalid)},            
            { name: 'PhoneNumber', id: 'phone_number', type: typePhone, placeholder: 'phone number', value: enteredInput?.phone_number, error: errors.phone_number, invalid: enteredInputIsInvalid.phone_number, required:true, onChange: (value) => handleGeneralUserInput('phone_number', value), onBlur : (e) => inputBlurHandle('phone_number', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Password', id: 'password', type: typePassword, placeholder: 'passord', error: errors.password, invalid: enteredInputIsInvalid.password,autoComplete: 'current-password', required: true, onBlur : (e) => inputBlurHandle('password', e.target.value, setEnteredInputIsInvalid)}, // , onChange: (e) => handleUserPassword('password', e.target.value)
            { name: 'Location', id: 'location', type: typeLocation, value: enteredInput?.city, cityList, stateList, cityId: enteredInput?.city_id, stateId: enteredInput?.state_id, error: errors.location, invalid: enteredInputIsInvalid.city,
                required:true , onChangeState: (e) => handleStatelUserInput('state', e.target.value), onChangeCity: (e) => handleCitylUserInput('city', e.target.value), onBlur : (e) => inputBlurHandle('city', e.target.value, setEnteredInputIsInvalid)},
        ]
    }

    function showErrors(identifier, message){ setErrors(() => { return {[identifier] : message} }) }

    const postRequest = async (data) => {        
        try {
            const options = { url: '/api/v2/register', method: 'POST'}
            const ApiOptions = ApiFetchPostOptions(options,data)            
            const request = await ApiFetch(ApiOptions)
            const response = await request.json()
        
            if(!request.ok) throw new HttpError('Something went wrong', 500, response.errors) 

            setErrors(inputValidList)            
            deleteLocalStorageItem(nameStorageItem)
            navigate('/dashboard', {replace: true})
            
        } catch (error) {
            const errorHandled = errorHandlerPostRequest(error, showErrors)
            if(!errorHandled) showBoundary(error)            
        }
    }

    function handleSubmit(event, enteredInput, setEnteredInputIsInvalid) {
        event.preventDefault()
        const pw = event.target.password.value
        const requestData = reconstructPostInput(enteredInput, pw)
        const checkInputUser = checkForInvalidInputUser(enteredInputIsInvalid)

        if(checkInputUser.bool){
            postRequest(requestData)            
        } else {
            const invalidField = checkInputUser.invalidField
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [invalidField] : true
            }))
        }
    }    
    // console.log({ enteredInput: enteredInput })
    // console.log({ enteredInput: errors })
    return (
        <>'
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
                            onChange={(e) => handleGeneralUserInput('conversion', e.target.value)} 
                            value={enteredInput?.conversion} 
                            placeholder={InterfaceConfiguration.descriptionToJoinTextArea}
                            onBlur={(e) => inputBlurHandle('conversion', e.target.value, setEnteredInputIsInvalid)}
                            required    
                        />
                    </label>
                    { enteredInputIsInvalid.conversion && <p className="text-red-500 text-xs italic">Please fill Message!</p> }
                    {enteredInput?.conversion && <p className="text-red-500 text-xs italic">
                        {errors.conversion}
                    </p>}
                    {/* ${lockedSubmitButton && 'opacity-50'} ${!lockedSubmitButton && 'hover:bg-[#686c6f] '} */}
                    <button 
                        className={`w-full py-3 mt-10 bg-[#063070] rounded-md
                        font-medium text-white uppercase focus:outline-none hover:shadow-none `}
                    >
                        {isSubmitting ? 'Submitting...' : InterfaceConfiguration.buttonname}
                    </button>

                    <section className="flex justify-center pt-6 pb-4">
                        <p><a>Already have a account? Sign in here!</a></p>
                    </section>
                </form>
            </section>
'
        </>
    )
}