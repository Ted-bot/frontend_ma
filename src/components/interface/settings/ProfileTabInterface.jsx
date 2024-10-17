import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form } from 'react-router-dom'

import { storageNameModifyUser, inputValidList } from '../../../js/util/auth.js'
import { useUserFormContext } from '../../../store/user-form-context.jsx'
import { getNewUserObjOrStorageData } from '../../../js/util/postUtil.js'
import CreateFormInterface from '../CreateFormInterface.jsx'
import { getAvailableLocations, getUserProfile } from '../../../store/features/users/userSlice.jsx' //, 

export const ProfileTabInterface = () => {
    const {state, dispatch} = useUserFormContext()
    const [enteredInput, setEnteredInput] = useState(getNewUserObjOrStorageData(storageNameModifyUser))
    const [errors, setErrors] = useState(inputValidList)
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    const reduxDispatch = useDispatch()
    const user = useSelector((state) => state.users.user)
    console.log({userObj: user})
    const {city_list:cityList, state_list: stateList, email, phone_number} = user

    console.log({email: email , phoneNumber: phone_number})
    let stateSelected = {id:2612}

    const getLocations = async (id) => {
        await reduxDispatch(getAvailableLocations(id))
    }

    useEffect(() => { 
        // console.log({stateSelected})
        getLocations(stateSelected.id)
        // reduxDispatch(getAvailableLocations(stateSelected.id))
        reduxDispatch(getUserProfile())
        
        const profileData = {
            email: email,
            phone_number: phone_number
        }
        setProfileData(profileData)
        
       
    }, [])

    function setProfileData(obj){
        for (const [key, value] of Object.entries(obj)) {
            console.log({loadKey: key, loadValue: value})
            setEnteredInput((prevValues) => ({
                ...prevValues,
                [key]: value
            }))
          }
    }
    
    const handleGeneralUserInput = (identifier, value) => {
        setEnteredInput((prevValues) => ({
            ...prevValues,
            [identifier]: value
        }))
        const updateUserForm = {[identifier]: value}
        dispatch({type: 'SET_GENERAL_USER_DATA', payload: updateUserForm})
    }

    const handleStatelUserInput = (identifier, value) => {
        stateSelected = stateList.find((state) => state.value == Number(value))      
        handleGeneralUserInput('state_id', stateSelected.value)        
        handleGeneralUserInput(identifier, stateSelected.label)
        reduxDispatch(getAvailableLocations(stateSelected.value))
    }

    const typeText = 'text'
    const typePhone = 'tel'
    const typeLocation = 'location'
    const InterfaceConfiguration = {
        buttonname: 'Save Changes',
        setItems : [
            { name: 'Email', id: 'email', type: typeText, placeholder: 'email', value: enteredInput?.email, error: errors.email, invalid: enteredInputIsInvalid.email, autoComplete: 'email', required:true, onChange: (e) => handleGeneralUserInput('email', e.target.value), onBlur : (e) => inputBlurHandle('email', e.target.value, setEnteredInputIsInvalid)},
            { name: 'PhoneNumber', id: 'phone_number', type: typePhone, placeholder: 'phone number', value: enteredInput?.phone_number, error: errors.phone_number, invalid: enteredInputIsInvalid.phone_number, required:true, onChange: (value) => handleGeneralUserInput('phone_number', value), onBlur : (e) => inputBlurHandle('phone_number', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Location', id: 'location', type: typeLocation, value: enteredInput?.city, cityId: enteredInput?.city_id, stateId: enteredInput?.state_id, error: errors?.location, invalid: enteredInputIsInvalid?.city,
                required:true , onChangeState: (e) => handleStatelUserInput('state', e.target.value), onChangeCity: (e) => handleCitylUserInput('city', e.target.value), onBlur : (e) => inputBlurHandle('city', e.target.value, setEnteredInputIsInvalid)},
            ]
    }

    console.log({enteredInputProfileTab: enteredInput})
    const handleSubmit = e => {
        e.preventDefault()
    }

    return(
        <>
            <Form onSubmit={handleSubmit} >
                <CreateFormInterface array={InterfaceConfiguration.setItems} />
                
                <button className="w-full py-3 mt-10 bg-[#063970] rounded-md
                        font-medium text-white uppercase
                        focus:outline-none hover:shadow-none hover:bg-[#4a8add]"
                    >
                        Update
                    </button>
            </Form>
        </>
    )
}