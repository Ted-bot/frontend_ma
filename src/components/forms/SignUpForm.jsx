import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import SignUpInterface from '../interface/SignUpInterface.jsx'
import { PostError } from '../js/error/PostError.js'
import { reconstructPostInput, foundInvalidInputData, prepRequestFields, inputValidList } from '../js/util/postUtil.js'
import { GetState, GetCity } from "react-country-state-city";

const typeText = 'text'
const typeEmail = 'email'
const typePassword = 'password'
const typePhone = 'tel'
const typeDate = 'date'
const typeCheckBox = 'checkbox'
const typeLocation = 'location'

function getInputValues(){
    const storedValues = localStorage.getItem('newuser')

    if(!storedValues){
        return prepRequestFields
    }

    return JSON.parse(storedValues) 
}

export default function SignUpForm() {

    const countryid = 156
    const regexSearch = /^[A-Za-z]+$/

    const [ save, setSave ] = useState()
    let navigate = useNavigate()

    const [genderStatusRequired, setGenderStatusRequired] = useState(true)
    const [enteredInput, setEnteredInput] = useState(getInputValues)
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
        setLocalStorage(enteredInput)
    }, [enteredInput])

    function setLocalStorage(enteredInput){
        localStorage.setItem('newuser', JSON.stringify(enteredInput))
    }
    
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
                    console.log({setCities: result})
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
            // console.log({ [identifier] : event.target.value})
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
                const year = event.split("-")[0]
                const age = currentYear - year

                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : (age < 7 || age > 60) ? true : false
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
            { name: 'FirstName', id: 'first_name', type: typeText, placeholder: 'first name', value: enteredInput.firstName, error: errors.first_name, invalid: enteredInputIsInvalid.firstName, required:true , onChange: (e) => inputHandle('firstName', e.target.value), onBlur : (e) => inputBlurHandle('firstName', e.target.value)},
            { name: 'LastName', id: 'last_name', type: typeText, placeholder: 'last name', value: enteredInput.lastName, error: errors.last_name, invalid: enteredInputIsInvalid.lastName, required:true , onChange: (e) => inputHandle('lastName', e.target.value), onBlur : (e) => inputBlurHandle('lastName', e.target.value)},
            { name: 'Email', id: 'email', type: typeEmail, placeholder: 'email', value: enteredInput.email, error: errors.email, invalid: enteredInputIsInvalid.email, required:true, onChange: (e) => inputHandle('email', e.target.value), onBlur : (e) => inputBlurHandle('email', e.target.value)},
            { name: 'Male', id: 'male', type: typeCheckBox, checked: (enteredInput.gender == 'male' ? true : false), value: 'male', required: genderStatusRequired, error: errors.male, onChange: (e) => inputHandle('gender', e.target.value)},
            { name: 'Female', id: 'female', type: typeCheckBox, checked: (enteredInput.gender == 'female' ? true : false), value: 'female', required: genderStatusRequired, error: errors.female, onChange: (e) => inputHandle('gender', e.target.value)},
            { name: 'DateOfBirth', id: 'date_of_birth', type: typeDate, value: enteredInput.dateOfBirth, error: errors.date_of_birth, required:true, onChange: (e) => inputHandle('dateOfBirth', e.target.value), onBlur : (e) => inputBlurHandle('dateOfBirth', e.target.value)},            
            { name: 'PhoneNumber', id: 'phone_number', type: typePhone, placeholder: 'phone number', value: enteredInput.phoneNumber, error: errors.phone_number, invalid: enteredInputIsInvalid.phone, required:true, onChange: (value) => inputHandle('phoneNumber', value), onBlur : (e) => inputBlurHandle('phone', e.target.value)},
            { name: 'Password', id: 'password', type: typePassword, placeholder: 'passord', error: errors.password, required: true, onBlur : (e) => inputBlurHandle('password', e.target.value)},
            { name: 'Location', id: 'location', type: typeLocation, value: enteredInput.city, cityList, stateList, stateId: enteredInput.state_id, error: errors.location, selectedStateIndexNr: enteredInput.state_id, selectedCityIndexNr: enteredInput.city_id, invalid: enteredInputIsInvalid.city, required:true , onChangeState: (e) => inputHandle('state', e), onChangeCity: (e) => inputHandle('city', e), onBlur : (e) => inputBlurHandle('city', e.target.value)},
        ]
    }

    const postRequest = async (data) => {
        console.log({req_input:data})
        try {
            const response = await fetch("/api/v2/register",{ 
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(data)
            })
        
            if(response.ok)
            {
                console.log({give_some_response:response})
                console.log('done')
                localStorage.removeItem("newuser")
                const reqResults = await response.json()
                console.log({total_response:reqResults})
                const contentParse = JSON.parse(reqResults.token.content)
                console.log({token_only: contentParse.token})
                setSave(reqResults)
                localStorage.setItem('auth', JSON.stringify(reqResults))
                navigate('/', {replace: true})
            } else { //if(response.status >= 400 && response.status <= 600)
                const errorJson = await response.json()
                throw new PostError(response, errorJson)
            }
        } catch (error) {

            if(error.backendReport != undefined && Array.isArray(error.backendReport.errors) && error.backendReport.errors.sql_state == null)
            {
                error.backendReport.errors.map((item) => {
                    console.log({test: item})
                    setErrors((prevValues) => {
                        return {
                            ...prevValues,
                            [item.property] : item.message
                        }
                    })
                })
            }
            else if(error.backendReport != undefined && Object.keys(error.backendReport.errors).length === 4) {
                setErrors(() => {
                    return {
                        [error.backendReport.errors.property[0]]: error.backendReport.errors.message
                    }
                })
            } else {
                console.log(error)
            }
        }
    }


    function handleSubmit(event, enteredInput, enteredInputIsInvalid) {
        event.preventDefault()
        
        const pw = event.target.password.value
        const requestData = reconstructPostInput(enteredInput, pw)
        console.log(requestData)
        foundInvalidInputData(enteredInputIsInvalid)
        postRequest(requestData)
    }

    console.log({success: save})

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
                    >
                        {InterfaceConfiguration.buttonname}
                    </button>

                    <section className="flex justify-center pt-6 pb-4">
                        <p><a>Already have a account? Sign in here!</a></p>
                    </section>
                </form>
            </section>
        </>
    )
}