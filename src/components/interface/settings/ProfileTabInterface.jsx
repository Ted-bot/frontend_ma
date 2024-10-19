import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form } from 'react-router-dom'

import { storageNameModifyUser, inputValidList } from '../../../js/util/auth.js'
import { useUserFormContext } from '../../../store/user-form-context.jsx'
import { getNewUserObjOrStorageData } from '../../../js/util/postUtil.js'
import CreateFormInterface from '../CreateFormInterface.jsx'
import { getAvailableLocations, getUserProfile, userActions, sendUpdatedUser } from '../../../store/features/users/userSlice.jsx' //, 
import { inputBlurHandle } from '../../class/userData/FormHelper.jsx'

export const ProfileTabInterface = () => {    
    const typeText = 'text'
    const typePhone = 'tel'
    const typeLocation = 'location'

    const [enteredInput, setEnteredInput] = useState(getNewUserObjOrStorageData(storageNameModifyUser))
    const [errors, setErrors] = useState(inputValidList)
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    const [buttonPressed, setButtonPressed] = useState(false)
    
    const {state, dispatch} = useUserFormContext()
    const reduxDispatch = useDispatch()
    const user = useSelector((state) => state.users.user)
    const {city_list:cityList, state_list: stateList, email, phone_number} = user
    let stateSelected = {id:2612}
    
    console.log({userObj: user})

    const getLocations = async (id) => {
        await reduxDispatch(getAvailableLocations(id))
    }

    useEffect(() => { 
        getLocations(stateSelected.id)
        // reduxDispatch(getAvailableLocations(stateSelected.id))
        reduxDispatch(getUserProfile())
        
        const profileData = {
            email: email,
            phone_number: phone_number
        }
        setProfileData(profileData)       
        setButtonPressed(true)
}, [buttonPressed])
    // }, [buttonPressed])

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

    const InterfaceConfiguration = {
        buttonname: 'Save Changes',
        setItems : [
            { name: 'Email', id: 'email', type: typeText, placeholder: 'email', defaultValue: email , value: enteredInput?.email, error: errors.email, invalid: enteredInputIsInvalid.email, autoComplete: 'email', onChange: (e) => handleGeneralUserInput('email', e.target.value), onBlur : (e) => inputBlurHandle('email', e.target.value, setEnteredInputIsInvalid)},
            { name: 'PhoneNumber', id: 'phone_number', type: typePhone, placeholder: 'phone number', defaultValue: phone_number, value: enteredInput?.phone_number, error: errors.phone_number, invalid: enteredInputIsInvalid.phone_number, onChange: (value) => handleGeneralUserInput('phone_number', value), onBlur : (e) => inputBlurHandle('phone_number', e.target.value, setEnteredInputIsInvalid)},
            // { name: 'Unit Number', id: 'unit_number',  type: typeText, placeholder: 'unit number', value: enteredInput?.unitNumber, invalid: enteredInputIsInvalid.unitNumber, error: errors?.unit_number, onChange: (e) => handleGeneralUserInput('unitNumber', e), onBlur: (e) => inputBlurHandle('unitNumber', e, typeText)},
            // { name: 'Street Number', id: 'street_number', type: 'number', placeholder: 'street number', min: 0,  value: enteredInput?.streetNumber, invalid: enteredInputIsInvalid.streetNumber, error: errors?.street_number,  true, onChange: (e) => handleGeneralUserInput('streetNumber', e), onBlur: (e) => inputBlurHandle('streetNumber', e, 'number')},
            // { name: 'Street Name', id: 'address_line', type: typeText, placeholder: 'address line', value: enteredInput?.addressLine, invalid: enteredInputIsInvalid.addressLine, error: errors?.address_line, true, onChange: (e) => handleGeneralUserInput('addressLine', e), onBlur: (e) => inputBlurHandle('addressLine', e, typeText)},
            // { name: 'Postal Code', id: 'postal_code', type: typeMixed, placeholder: 'postal code', value: enteredInput?.postalCode, invalid: enteredInputIsInvalid.postalCode, error: errors?.postalCode, true, onChange: (e) => handleGeneralUserInput('postalCode', e), onBlur: (e) => inputBlurHandle('postalCode', e, typeMixed) },
            // { name: 'Location', id: 'location', type: typeLocation, value: enteredInput?.city, cityId: enteredInput?.city_id, stateId: enteredInput?.state_id, error: errors?.location, invalid: enteredInputIsInvalid?.city,
            //     onChangeState: (e) => handleStatelUserInput('state', e.target.value), onChangeCity: (e) => handleCitylUserInput('city', e.target.value), onBlur : (e) => inputBlurHandle('city', e.target.value, setEnteredInputIsInvalid)},
            ]
    }
    
    console.log({enteredInputProfileTab: InterfaceConfiguration.setItems})

    const handleSubmit = (e) => {
        let data = {}
        for (const [key, value] of Object.entries(e.target)){
            if(value.id === 'location' || value.id === 'region' || !value.id) continue
            data = {...data, [value.id]: value.value}
        }
        reduxDispatch(sendUpdatedUser(data))
        setButtonPressed(true)
    }

    return(
        <>
            <Form onSubmit={handleSubmit} className='flex-col md:justify-item-center' >
                <CreateFormInterface array={InterfaceConfiguration.setItems} />
                <section className='inline-flex w-full justify-center md:w-1/2'>
                    <button className="w-full py-3 mt-10 bg-[#063970] rounded-md
                            font-medium text-white uppercase md:w-4/5
                            focus:outline-none hover:shadow-none hover:bg-[#4a8add]"
                        >
                            Update
                    </button>
                </section>
            </Form>
        </>
    )
}