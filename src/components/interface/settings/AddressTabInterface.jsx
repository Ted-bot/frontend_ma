import { useState, useEffect } from 'react'
import { Form } from 'react-router-dom'

import { storageNameModifyUser, inputValidList } from '../../../js/util/auth.js'
import { getUpdateUserObjOrStorageData } from '../../../js/util/postUtil.js'
import { inputBlurHandle } from '../../class/userData/FormHelper.jsx'
import { useGetIdentity } from 'react-admin'
import { dataProvider } from '../../../dataProvider/main/DataProvider.jsx'
import { useNotify } from 'react-admin'
import { useErrorBoundary } from "react-error-boundary"
import { errorPayloadHandler } from '../../class/userData/FormHelper.jsx'
import DashboardFormInterface from '../DashboardFormInterface'

export const AddressTabInterface = () => {    
    const typeText = 'text'
    const typeMixed = 'mixed'
    const typeNumber = 'number'
    const typeLocation = 'location'
    const notify = useNotify()

    const { 
        isPending: isLoading,
        error: isError,
        refetch,
        data: userIdentity = {
        userAddress: {
            cityId: '',
            city: '',
            stateId: '',
            // stateId: 2612,
            unitNumber: '',
            streetNumber: '',
            postalCode: '',
            addressLine: ''
            }
        },
    } = useGetIdentity()

    const [enteredInput, setEnteredInput] = useState(getUpdateUserObjOrStorageData(storageNameModifyUser))
    const [errors, setErrors] = useState(inputValidList)
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    const {showBoundary} = useErrorBoundary()

    useEffect(() => {
        if(userIdentity?.userAddress){
            handleGeneralUserInput('city_id', Number(userIdentity?.userAddress.cityId))
            handleGeneralUserInput('state_id', Number(userIdentity?.userAddress.stateId))
            handleGeneralUserInput('unitNumber', userIdentity?.userAddress.unitNumber)
            handleGeneralUserInput('streetNumber', userIdentity?.userAddress.streetNumber)
            handleGeneralUserInput('postalCode', userIdentity?.userAddress.postalCode)
            handleGeneralUserInput('addressLine', userIdentity?.userAddress.addressLine)
        }
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
            { name: 'Unit Number', id: 'unit_number',  type: typeText, placeholder: 'unit number', value: enteredInput?.unitNumber ?? '', invalid: enteredInputIsInvalid?.unit_number, error: errors?.unit_number, onChange: (e) => handleGeneralUserInput('unitNumber', e.target.value), onBlur: (e) => inputBlurHandle('unit_number', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Street Number', id: 'street_number', type: typeNumber, placeholder: 'street number', value: enteredInput?.streetNumber ?? '', invalid: enteredInputIsInvalid?.street_number, error: errors?.street_number, onChange: (e) => handleGeneralUserInput('streetNumber', e.target.value), onBlur: (e) => inputBlurHandle('street_number', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Street Name', id: 'address_line', type: typeText, placeholder: 'address line', value: enteredInput?.addressLine ?? '', invalid: enteredInputIsInvalid?.address_line, error: errors?.address_line, onChange: (e) => handleGeneralUserInput('addressLine', e.target.value), onBlur: (e) => inputBlurHandle('address_line', e.target.value, setEnteredInputIsInvalid)},
            { name: 'Postal Code', id: 'postal_code', type: typeText, placeholder: 'postal code', value: enteredInput?.postalCode ?? '', invalid: enteredInputIsInvalid?.postal_code, error: errors?.postal_code, onChange: (e) => handleGeneralUserInput('postalCode', e.target.value), onBlur: (e) => inputBlurHandle('postal_code', e.target.value, setEnteredInputIsInvalid) },
            { name: 'Location', id: 'location', type: typeLocation, stateError: errors?.state_id, cityError: errors?.city_id, stateId: Number(enteredInput?.state_id), cityId: Number(enteredInput?.city_id),
                onChangeState: e => handleGeneralUserInput('state_id', e), onChangeCityId: e => handleGeneralUserInput('city_id', e), onChangeCity: e => handleGeneralUserInput('city', e)},
            ]
    }

    function showErrors(identifier, message){ setErrors(() => { 
        return {[identifier] : message} 
    }) }

    const handleSubmit = e => {
        e.preventDefault()

        let data = {
            state_id: Number(e?.target[8].value) ?? userIdentity?.userAddress?.state_id,
            city_id: Number(enteredInput.city_id) ?? userIdentity?.userAddress?.city_id,
            city: enteredInput.city ?? userIdentity?.userAddress?.city,
            address_id: userIdentity?.userAddress?.AddressId ?? null
        }

        for (const [key, value] of Object.entries(e.target)){
            if(value.id === 'undefined' || !value.id) continue
            data = {...data, [value.id]: value.value}
        }
        console.log("enteredInput", data)
        
        dataProvider.updateUserAddress('user_address_dashboard', {email: userIdentity?.email, id: data?.address_id},data)
        .then(() => {
            refetch()
            notify(`Success updating Address`, { type: 'success' })
        }).catch((error) => {
            const errorHandled = errorPayloadHandler(error, showErrors)
            if(!errorHandled) notify(`${error.message}`, { type: 'error' })
        })
    }

    console.log({GotErrors: errors})

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