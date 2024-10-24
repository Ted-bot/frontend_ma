import { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { Form } from 'react-router-dom'

import { storageNameModifyUser, inputValidList } from '../../../js/util/auth.js'
import { useUserFormContext } from '../../../store/user-form-context.jsx'
import { getNewUserObjOrStorageData } from '../../../js/util/postUtil.js'
import CreateFormInterface from '../CreateFormInterface.jsx'
import { inputBlurHandle } from '../../class/userData/FormHelper.jsx'
// import { getAvailableLocations } from '../../../store/features/location/locationSlice.jsx' //, 
// import { useGetLocationsQuery } from '../../../store/features/api/apiSlice.jsx'
// import { useGetUserRecentAddressQuery } from '../../../store/features/api/apiSlice.jsx'
// import { selectUsersResult } from '../../../store/features/users/userSlice.jsx'

export const AddressTabInterface = () => {    
    const typeText = 'text'
    const typeMixed = 'mixed'
    const typeLocation = 'location'
    let stateSelected = {id:2612}

    const [enteredInput, setEnteredInput] = useState(getNewUserObjOrStorageData(storageNameModifyUser))
    const [errors, setErrors] = useState(inputValidList)
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    const [buttonPressed, setButtonPressed] = useState(false)
    
    const {state, dispatch} = useUserFormContext()
    const reduxDispatch = useDispatch()
    const {data: userRecentAddress} = useGetUserRecentAddressQuery()
    // const getLocations = async (id) => {
    //     await useGetLocationsQuery(id)
    //     // await reduxDispatch(getAvailableLocations(id))
    // }
    const user = selectUsersResult()
    // const {city_list:cityList, state_list: stateList} = getLocations(stateSelected.id) // , state_id: stateId, city_id: cityId
    const {city_list:cityList, state_list: stateList, state_id: stateId, city_id: cityId, phone_number} = user // , state_id: stateId, city_id: cityId
    
    console.log({userObj: user, stateId, cityId})


    useEffect(() => { 
        // getLocations(stateSelected.id)
        reduxDispatch(getAvailableLocations(stateSelected.id))
        // reduxDispatch(getUserProfile())
        
        setAddressData(user)       
        setButtonPressed(true)
}, [buttonPressed])

    function setAddressData(obj){
        for (const [key, value] of Object.entries(obj)) {
            if(key != 'state_id' || key != 'city_id') continue
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

    const handleCitylUserInput = (identifier, value) => {
        const city = cityList.find((city) => city.value === value)
        // console.log({gotCity: city, value, identifier})
        handleGeneralUserInput(identifier, city.label)
        handleGeneralUserInput('city_id', city.value)
    }

    const InterfaceConfiguration = {
        buttonname: 'Save Changes',
        setItems : [
            { name: 'Unit Number', id: 'unit_number',  type: typeText, placeholder: 'unit number', defaultValue: '',value: enteredInput?.unitNumber, invalid: enteredInputIsInvalid.unitNumber, error: errors?.unit_number, onChange: (e) => handleGeneralUserInput('unitNumber', e), onBlur: (e) => inputBlurHandle('unitNumber', e, typeText)},
            { name: 'Street Number', id: 'street_number', type: typeText, placeholder: 'street number', min: 0, defaultValue: '',value: enteredInput?.streetNumber, invalid: enteredInputIsInvalid.streetNumber, error: errors?.street_number, onChange: (e) => handleGeneralUserInput('streetNumber', e), onBlur: (e) => inputBlurHandle('streetNumber', e, 'number')},
            { name: 'Street Name', id: 'address_line', type: typeText, placeholder: 'address line', defaultValue: '',value: enteredInput?.addressLine, invalid: enteredInputIsInvalid.addressLine, error: errors?.address_line, onChange: (e) => handleGeneralUserInput('addressLine', e), onBlur: (e) => inputBlurHandle('addressLine', e, typeText)},
            { name: 'Postal Code', id: 'postal_code', type: typeText, placeholder: 'postal code', defaultValue: '',value: enteredInput?.postalCode, invalid: enteredInputIsInvalid.postalCode, error: errors?.postalCode, onChange: (e) => handleGeneralUserInput('postalCode', e), onBlur: (e) => inputBlurHandle('postalCode', e, typeMixed) },
            { name: 'Location', id: 'location', type: typeLocation, value: enteredInput?.city, cityId: enteredInput?.city_id, stateId: enteredInput?.state_id, error: errors?.location, invalid: enteredInputIsInvalid?.city,
                onChangeState: (e) => handleStatelUserInput('state', e.target.value), onChangeCity: (e) => handleCitylUserInput('city', e.target.value), onBlur : (e) => inputBlurHandle('city', e.target.value, setEnteredInputIsInvalid)},
            ]
    }
    
    console.log({enteredInputProfileTab: InterfaceConfiguration.setItems})

    const handleSubmit = (e) => {
        let data = {}
        for (const [key, value] of Object.entries(e.target)){
            if(value.id === 'location' || value.id === 'region' || !value.id) continue
            data = {...data, [value.id]: value.value}
        }
        reduxDispatch(sendUpdateNotification(data))
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