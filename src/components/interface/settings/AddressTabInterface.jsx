import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form } from 'react-router-dom'

import { storageNameModifyUser, inputValidList } from '../../../js/util/auth.js'
import { useUserFormContext } from '../../../store/user-form-context.jsx'
import { getNewUserObjOrStorageData } from '../../../js/util/postUtil.js'
import CreateFormInterface from '../CreateFormInterface.jsx'
import { getAvailableLocations, getUserProfile } from '../../../store/features/users/userSlice.jsx' //, 

export const AddressTabInterface = () => {    
    const typeText = 'text'
    const typeLocation = 'location'
    const typeMixed = 'mixed' 

    const [enteredInput, setEnteredInput] = useState(getNewUserObjOrStorageData(storageNameModifyUser))
    const [errors, setErrors] = useState(inputValidList)
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    
    const {state, dispatch} = useUserFormContext()
    const reduxDispatch = useDispatch()
    const user = useSelector((state) => state.users.user)
    console.log({userObj: user})
    const {
        city_list:cityList, 
        state_list: stateList, 
        unit_number, 
        street_number,
        // postal_code,
        // postal_code,
    } = user

    console.log({unit_number: unit_number , street_number: street_number})
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
            unit_number: unit_number,
            street_number: street_number
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

    const InterfaceConfiguration = {
        buttonname: 'Save Changes',
        setItems : [
            { name: 'Unit Number', id: 'unit_number',  type: typeText, placeholder: 'unit number', value: enteredInput?.unitNumber, invalid: enteredInputIsInvalid.unitNumber, error: errors?.unit_number, onChange: (e) => handleGeneralUserInput('unitNumber', e), onBlur: (e) => inputBlurHandle('unitNumber', e, typeText)},
            { name: 'Street Number', id: 'street_number', type: 'number', placeholder: 'street number', min: 0,  value: enteredInput?.streetNumber, invalid: enteredInputIsInvalid.streetNumber, error: errors?.street_number,  required : true, onChange: (e) => handleGeneralUserInput('streetNumber', e), onBlur: (e) => inputBlurHandle('streetNumber', e, 'number')},
            { name: 'Street Name', id: 'address_line', type: typeText, placeholder: 'address line', value: enteredInput?.addressLine, invalid: enteredInputIsInvalid.addressLine, error: errors?.address_line, required : true, onChange: (e) => handleGeneralUserInput('addressLine', e), onBlur: (e) => inputBlurHandle('addressLine', e, typeText)},
            { name: 'Postal Code', id: 'postal_code', type: typeMixed, placeholder: 'postal code', value: enteredInput?.postalCode, invalid: enteredInputIsInvalid.postalCode, error: errors?.postalCode, required : true, onChange: (e) => handleGeneralUserInput('postalCode', e), onBlur: (e) => inputBlurHandle('postalCode', e, typeMixed) },
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