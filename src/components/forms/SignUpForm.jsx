import { useState, useEffect } from 'react'
import SignUpInterface from '../interface/SignUpInterface.jsx'
// import {
//     GetCountries,
//     GetState,
//     GetCity,
//   } from "react-country-state-city";

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
        return {
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            city: '',
            dateOfBirth: '',
            phone: '',
            conversion: '',
        }
    }

    return JSON.parse(storedValues) 
}

export default function SignUpForm() {

    const re = /^[A-Za-z]+$/

    const [genderStatusRequired, setGenderStatusRequired] = useState(true)
    const [enteredInput, setEnteredInput] = useState(getInputValues)
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState({
        gender: false,
        firstName: false,
        lastName: false,
        email: false,
        city: false,
        dateOfBirth: false,
        phone: false,
        conversion: false,
        password: false,
    })

    // const [ stateId, setStateId ] = useState(null)
    // const [ cityId, setCityId ] = useState(null)

    // const [countryid, setCountryid] = useState(0);
    // const [stateid, setStateid] = useState(0);
    // const [cityid, setCityid] = useState(0);

    // const [countriesList, setCountriesList] = useState([]);
    // const [stateList, setStateList] = useState([]);
    // const [cityList, setCityList] = useState([]);

    function inputHandle(identifier, value){

        if(identifier == 'gender' && value == 'male' || value == 'female')
            {
                genderStatusRequired === true ? setGenderStatusRequired(false) : ''
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : value ? false : true
                }))
            }

        if(identifier == 'city')
            {
               return updateEnteredInputState(identifier, value.name)
            }

        updateEnteredInputState(identifier, value)
    }

    function inputBlurHandle(identifier, value) {
        if(identifier == 'firstName' || identifier == 'lastName')
            {
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : re.test(value) ? false : true
                }))
            }
    
        if(identifier == 'email')
            {
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : (!value.includes('@') || value == '' || value === null) ? true : false
                }))
            }

        if(identifier == 'dateOfBirth' )
            {
                const currentYear = new Date().getFullYear();
                const year = value.split("-")[0]
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
                    [identifier] : (value == '') ? true : false
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
            { name: 'FirstName', id: 'firstName', type: typeText, placeholder: 'first name', value: enteredInput.firstName, error: enteredInputIsInvalid.firstName, required:true , onChange: (e) => inputHandle('firstName', e.target.value), onBlur : (e) => inputBlurHandle('firstName', e.target.value)},
            { name: 'LastName', id: 'lastName', type: typeText, placeholder: 'last name', value: enteredInput.lastName, error: enteredInputIsInvalid.lastName, required:true , onChange: (e) => inputHandle('lastName', e.target.value), onBlur : (e) => inputBlurHandle('lastName', e.target.value)},
            { name: 'Email', id: 'email', type: typeEmail, placeholder: 'email', value: enteredInput.email, error: enteredInputIsInvalid.email, onChange: (e) => inputHandle('email', e.target.value), onBlur : (e) => inputBlurHandle('email', e.target.value), required:true},
            { name: 'Male', id: 'male', type: typeCheckBox, checked: (enteredInput.gender == 'male' ? true : false), value: 'male', error: enteredInputIsInvalid.gender, required: genderStatusRequired, onChange: (e) => inputHandle('gender', e.target.value), onBlur : (e) => inputBlurHandle('gender', e.target.value)},
            { name: 'Female', id: 'female', type: typeCheckBox, checked: (enteredInput.gender == 'female' ? true : false), value: 'female', error: enteredInputIsInvalid.gender, required: genderStatusRequired, onChange: (e) => inputHandle('gender', e.target.value), onBlur : (e) => inputBlurHandle('gender', e.target.value)},
            { name: 'DateOfBirth', id: 'birthday', type: typeDate, value: enteredInput.dateOfBirth, error: enteredInputIsInvalid.dateOfBirth, required:true, onChange: (e) => inputHandle('dateOfBirth', e.target.value), onBlur : (e) => inputBlurHandle('dateOfBirth', e.target.value)},            
            { name: 'Location', id: 'location', type: typeLocation, value: enteredInput.city, error: enteredInputIsInvalid.city, required:true , onChange: (e) => inputHandle('city', e), onBlur : (e) => inputBlurHandle('city', e.target.value)},
            { name: 'Phone', id: 'phonenumber', type: typePhone, placeholder: 'phone number', value: enteredInput.phone, error: enteredInputIsInvalid.phone, required:true, onChange: (value) => inputHandle('phone', value), onBlur : (e) => inputBlurHandle('phone', e.target.value)},
            { name: 'Password', id: 'password', type: typePassword, placeholder: 'passord', error: enteredInputIsInvalid.password,required: true, onBlur : (e) => inputBlurHandle('password', e.target.value)}
        ]
    }

    function handleSubmit(event) {
        event.preventDefault()

        let InvalidInputFound = false

        const firstName = 'firstName'
        const lastName = 'lastName'
        const dateOfBirth = 'dateOfBirth'
        const male = 'male'
        const female = 'female'
        const phone = 'phone'
         
        const fd = new FormData(event.target)
        const FormEntries = Object.fromEntries(fd.entries())

        // console.log(FormEntries)

        let newUserData = {
            password: FormEntries.password
        }        
        
        for (const key in enteredInputIsInvalid)
        {
            if(enteredInputIsInvalid[key] === true)
            {
                return InvalidInputFound = true;
            }
        }

        if(InvalidInputFound){
            return
        }    

        for (const key in enteredInput) {
            
            let newKey = ''

            switch (key){
                case firstName:
                    newKey = 'first_name'
                    break
                case lastName:
                    newKey = 'last_name'
                    break
                case dateOfBirth:
                    newKey = 'date_of_birth'
                    break
                case male || female :
                    newKey = 'gender'
                    break
                case phone :
                    newKey = 'phone_number'
                    break
                default:
                    newKey = key
            }

            newUserData[newKey] = enteredInput[key];
        }

        // // console.log({newUserDate: newUserData})

        // fetch("/api/register", { 
        //     method: "POST",
        //     headers: {
        //         "Content-Type":"application/json" 
        //     },
        //     body: JSON.stringify({newUserData})
        // })
        // .then((response) => {
        //     return response.json()
        // })
        // .then((response) => {
        //     console.log({ data: response })
        //     return response
        // })
    }

    useEffect(() => {
       localStorage.setItem('newuser', JSON.stringify(enteredInput))
    }, [enteredInput]);

    // useEffect(() => {
    //     GetCountries().then((result) => {
    //       setCountriesList(result);
    //     });
    
        
    //   }, []);

    return (
        <>
            <section className="flex flex-col items-center shadow-md bg-slate-100 py-5 rounded-md px-3 sm:mx-4 w-full sm:px-5 sm:w-4/5 md:px-3 md:shadow-xl">

                <h1 className="pt-3 pb-6 text-2xl">{InterfaceConfiguration.title}</h1>

                <form onSubmit={handleSubmit} name='sign-up' id='sign-up'>

                    <section className="flex flex-wrap -mx-3 mb-6">
                       <SignUpInterface array={InterfaceConfiguration.setItems} />                        
                    </section>

                    <label className="w-full">
                        {InterfaceConfiguration.titleTextArea}
                        <textarea 
                            name="conversion" 
                            rows={4} 
                            cols={40} 
                            className={`${enteredInputIsInvalid.conversion && 'border-red-500'} border rounded px-2 pt-1 w-full`}
                            onChange={(e) => inputHandle('conversion', e.target.value)} 
                            value={enteredInput.conversion} 
                            placeholder={InterfaceConfiguration.descriptionToJoinTextArea}
                            onBlur={(e) => inputBlurHandle('conversion', e.target.value)}
                            required    
                        />
                    </label>
                    { enteredInputIsInvalid.conversion && <p className="text-red-500 text-xs italic">Please fill Message!</p> }

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