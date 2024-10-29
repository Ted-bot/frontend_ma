import { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { Form } from 'react-router-dom'

import { storageNameModifyUser, inputValidList } from '../../../js/util/auth.js'
import { useUserFormContext } from '../../../store/user-form-context.jsx'
import { getUpdateUserObjOrStorageData } from '../../../js/util/postUtil.js'
import CreateFormInterface from '../CreateFormInterface.jsx'
import { inputBlurHandle } from '../../class/userData/FormHelper.jsx'
import { useGetIdentity } from 'react-admin'
import { changeObjKeysToCamelCaseFields } from '../../../js/util/postUtil.js'
import { dataProvider } from '../../../dataProvider/main/DataProvider.jsx'
import { LocationState, LocationCity } from '../../../store/index'
import { useNotify } from 'react-admin'
import { useErrorBoundary } from "react-error-boundary"
import { errorPayloadHandler } from '../../class/userData/FormHelper.jsx'
import DashboardFormInterface from '../DashboardFormInterface'


export const AddressTabInterface = () => {    
    const typeText = 'text'
    const typeMixed = 'mixed'
    const typeLocation = 'location'
    const notify = useNotify()

    const { isPending: isLoading, error: isError, data: userIdentity = {city_id: '77339', state_id: '2612'} } = useGetIdentity()

    const [enteredInput, setEnteredInput] = useState(getUpdateUserObjOrStorageData(storageNameModifyUser))
    // state_id: 2612, city_id: 77618
    const [errors, setErrors] = useState(inputValidList)
    const [selectedCity, setSelectedCity] = useState()
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    const {showBoundary} = useErrorBoundary()

    

    useEffect(() => {
        // console.log('got city id', userIdentity.userAddress.cityId)
        // console.log('got state id', userIdentity.userAddress.stateId)
        handleGeneralUserInput('city_id', Number(userIdentity.userAddress.cityId))
        handleGeneralUserInput('state_id', Number(userIdentity.userAddress.stateId))
        handleGeneralUserInput('unitNumber', userIdentity.userAddress.unitNumber)
        handleGeneralUserInput('streetNumber', userIdentity.userAddress.streetNumber)
        handleGeneralUserInput('postalCode', userIdentity.userAddress.postalCode)
        handleGeneralUserInput('addressLine', userIdentity.userAddress.addressLine)
    },[])
    
    const handleGeneralUserInput = (identifier, value) => {
        console.log({Got_Value: value})
        setEnteredInput((prevValues) => ({
            ...prevValues,
            [identifier]: value
        }))
    }

    const InterfaceConfiguration = {
        buttonname: 'Save Changes',
        setItems : [
            { name: 'Unit Number', id: 'unit_number',  type: typeText, placeholder: 'unit number', value: enteredInput?.unitNumber, invalid: enteredInputIsInvalid.unit_number, error: errors?.unit_number, onChange: (e) => handleGeneralUserInput('unitNumber', e.target.value), onBlur: (e) => inputBlurHandle('unit_number', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Street Number', id: 'street_number', type: typeText, placeholder: 'street number', value: enteredInput?.streetNumber, invalid: enteredInputIsInvalid.street_number, error: errors?.street_number, onChange: (e) => handleGeneralUserInput('streetNumber', e.target.value), onBlur: (e) => inputBlurHandle('street_number', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Street Name', id: 'address_line', type: typeText, placeholder: 'address line', value: enteredInput?.addressLine, invalid: enteredInputIsInvalid.address_line, error: errors?.address_line, onChange: (e) => handleGeneralUserInput('addressLine', e.target.value), onBlur: (e) => inputBlurHandle('address_line', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Postal Code', id: 'postal_code', type: typeText, placeholder: 'postal code', value: enteredInput?.postalCode, invalid: enteredInputIsInvalid.postal_code, error: errors?.postal_code, onChange: (e) => handleGeneralUserInput('postalCode', e.target.value), onBlur: (e) => inputBlurHandle('postal_code', e.target.value, setEnteredInputIsInvalid) },
            { name: 'Location', id: 'location', type: typeLocation, stateError: errors.state_id, cityError: errors.city_id, stateId: enteredInput?.state_id, cityId: enteredInput?.city_id,
                onChange: setSelectedCity},
            ]
    }

    function showErrors(identifier, message){ setErrors(() => { 
        return {[identifier] : message} 
    }) }

    const handleSubmit = e => {
        e.preventDefault()
        let data = {state_id: e?.target[8].value, city_id: e?.target[9].value, city: selectedCity ?? userIdentity?.location, address_id: userIdentity.userAddress.AddressId}
        for (const [key, value] of Object.entries(e.target)){
            if(value.id === 'undefined' || !value.id) continue
            data = {...data, [value.id]: value.value}
        }
        // const requstBody = changeObjKeysToCamelCaseFields(data)
        // console.log({ready_to_send_request:data})
        dataProvider.updateUserAddress('user_address_dashboard', {email: userIdentity?.email, id: data.address_id},data)
        .then(() => {
            notify(`Success updating Address`, { type: 'success' })
        }).catch((error) => {
            // errorPayloadHandler(error, showErrors)
            const errorHandled = errorPayloadHandler(error, showErrors)
            if(!errorHandled) showBoundary(error)  
            notify(`Failed updating Address`, { type: 'error' })
        })
    }

    console.log('enteredInput', enteredInput)

    return(
        <>
            <Form onSubmit={handleSubmit} className='flex justify-center' >
                <section className='flex-col w-full lg:w-2/3'>
                    <DashboardFormInterface array={InterfaceConfiguration.setItems} />
                    <section className='inline-flex w-full justify-center'>
                        <button className="w-1/2 py-3 mt-10 bg-[#063970] rounded-md
                                font-medium text-white uppercase md:w-4/5
                                focus:outline-none hover:shadow-none hover:bg-[#4a8add]"
                            >
                                Update
                        </button>
                    </section>

                </section>
            </Form>
        </>
    )
}