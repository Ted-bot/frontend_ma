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
import { useGetIdentity } from 'react-admin'
import { changeObjKeysToCamelCaseFields } from '../../../js/util/postUtil.js'
import { dataProvider } from '../../../dataProvider/main/DataProvider.jsx'
import { LocationState, LocationCity } from '../../../store/index'


export const AddressTabInterface = () => {    
    const typeText = 'text'
    const typeMixed = 'mixed'
    const typeLocation = 'location'

    const { isPending: isLoading, error: isError, data: userIdentity = {email: '', phoneNumber: ''}, refetch } = useGetIdentity()

    const [enteredInput, setEnteredInput] = useState(getNewUserObjOrStorageData(storageNameModifyUser))
    const [errors, setErrors] = useState(inputValidList)
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    

    useEffect(() => {
        handleGeneralUserInput('city_id', Number(userIdentity.libReactCity))
        handleGeneralUserInput('state_id', Number(userIdentity.libReactState))
        handleGeneralUserInput('unitNumber', userIdentity.userAddress.unitNumber)
        handleGeneralUserInput('streetNumber', userIdentity.userAddress.streetNumber)
        handleGeneralUserInput('postalCode', userIdentity.userAddress.postalCode)
        handleGeneralUserInput('addressLine', userIdentity.userAddress.addressLine)
    },[])

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
        // const updateUserForm = {[identifier]: value}
        // dispatch({type: 'SET_GENERAL_USER_DATA', payload: updateUserForm})
    }

    const InterfaceConfiguration = {
        buttonname: 'Save Changes',
        setItems : [
            { name: 'Unit Number', id: 'unit_number',  type: typeText, placeholder: 'unit number', value: enteredInput?.unitNumber, invalid: enteredInputIsInvalid.unit_number, error: errors?.unit_number, onChange: (e) => handleGeneralUserInput('unitNumber', e), onBlur: (e) => inputBlurHandle('unit_number', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Street Number', id: 'street_number', type: typeText, placeholder: 'street number', value: enteredInput?.streetNumber, invalid: enteredInputIsInvalid.street_number, error: errors?.street_number, onChange: (e) => handleGeneralUserInput('streetNumber', e.target.value), onBlur: (e) => inputBlurHandle('street_number', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Street Name', id: 'address_line', type: typeText, placeholder: 'address line', value: enteredInput?.addressLine, invalid: enteredInputIsInvalid.address_line, error: errors?.address_line, onChange: (e) => handleGeneralUserInput('addressLine', e.target.value), onBlur: (e) => inputBlurHandle('address_line', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Postal Code', id: 'postal_code', type: typeText, placeholder: 'postal code', value: enteredInput?.postalCode, invalid: enteredInputIsInvalid.postal_code, error: errors?.postalCode, onChange: (e) => handleGeneralUserInput('postalCode', e.target.value), onBlur: (e) => inputBlurHandle('postal_code', e.target.value, setEnteredInputIsInvalid) },
            { name: 'Location', id: 'location', type: typeLocation, error: errors?.location, stateId: enteredInput?.state_id, cityId: enteredInput?.city_id},
            ]
    }
    
    console.log({enteredInputIsInvalid: enteredInputIsInvalid})

    const handleSubmit = (e) => {
        let data = {}
        for (const [key, value] of Object.entries(e.target)){
            if(value.id === 'undefined' || value.id === 'region' || !value.id) continue
            data = {...data, [value.id]: value.value}
        }
        const requstBody = changeObjKeysToCamelCaseFields(data)
        console.log({ready_to_send_request:requstBody})
        // reduxDispatch(sendUpdateNotification(data))
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