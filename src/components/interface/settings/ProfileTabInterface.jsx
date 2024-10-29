import { useState, useEffect } from 'react'
import { Form } from 'react-router-dom'

import { storageNameModifyUser, inputValidList } from '../../../js/util/auth.js'
import { changeObjKeysToCamelCaseFields } from '../../../js/util/postUtil.js'
import { inputBlurHandle } from '../../class/userData/FormHelper.jsx'
import { useGetIdentity, useUpdate, useNotify, useRefresh } from 'react-admin'
import { dataProvider } from '../../../dataProvider/main/DataProvider.jsx'
import { TextField } from '@mui/material'
import { MuiTelInput } from 'mui-tel-input'
import { useLogout } from 'react-admin'
import { useErrorBoundary } from "react-error-boundary"


export const ProfileTabInterface = () => {

    let data = {}
    let message = ''
    const { isPending: isLoading, error: isError, data: userIdentity = {email: '', phoneNumber: ''}, refetch } = useGetIdentity()
    const [enteredInput, setEnteredInput] = useState({email: '', phoneNumber: ''})
    const [errors, setErrors] = useState({email: '', phone_number: ''})
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    const [phoneNumber, setPhoneNumber] = useState()
    const notify = useNotify()
    const refresh = useRefresh()
    const defaultPhoneNumber = userIdentity?.phoneNumber
    const defaultEmail = userIdentity?.email
    const logout = useLogout()
    const {showBoundary} = useErrorBoundary()
    
    const onPhoneChanged = (val) => {
        setPhoneNumber(val)
    }
    function showErrors(identifier, message){ setErrors(() => { 
        return {[identifier] : message} 
    }) }

    useEffect(() => { 
        console.log({newData: userIdentity})
        setProfileData(userIdentity)
        setPhoneNumber(defaultPhoneNumber)
        // setButtonPressed(false)
    }, [userIdentity?.phoneNumber])

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
    }

    
    console.log({defaultNumber: defaultPhoneNumber})

    // const [message, setMessage] = useState('')
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log({WhatToUpdate:e.target})
        for (const [key, value] of Object.entries(e.target)){
            if(value.id === 'location' || value.id === 'region' || !value.id) continue
            data = {...data, [value.id]: value.value}

            if(value.id === 'email' && defaultEmail != value.value) {
                if(message){
                    message = value.id
                } else {
                    message = message + ' ' + value.id                    
                }
                alert(`please logout and login with new email ${value.value}`)                
            }

            if(value.id === 'phone_number' && defaultPhoneNumber != value.value) {
                if(!message){
                     message = value.id
                } else {
                    message = message + ' ' + value.id
                }
            }
        }
        const requestBody = changeObjKeysToCamelCaseFields(data)
        console.log({halloError: message})

        dataProvider.updateUserIdentity('user_by_email', userIdentity?.email,requestBody)
        .then(() => {
            refetch()
            notify(`Success updating ${message}`, { type: 'success' })
            if(e.target.email.value != defaultEmail){
                console.log({
                    compare: (e.target.email.value === defaultEmail),
                    defaultNr: defaultEmail,
                    newNr: e.target.email.value 
                })
                logout()
            }
        }).catch((error) => {
            const errorHandled = errorHandlerPostRequest(error, showErrors)
            if(!errorHandled) showBoundary(error)   
            // console.log({Failed_update: error})
            notify(`Failed updating ${message}`, { type: 'error' })
        })
        
       
    }

    if (isLoading) {
        console.log({RTKisLoading: 'is Loading', error: isLoading}) //<Spinner text="Loading..." />]
    } else if (isError) {
        console.log({RTKisError: 'FAiled Data', error: isError})
    }

    return(
        <>
            <Form onSubmit={handleSubmit} className='flex-col justify-center' >
                {isError && <div> Something went wrong {isError.toString()}</div>}
                {isLoading && <p>Loading...</p>}
                {userIdentity && <>
                    <section className='flex-wrap justify-items-center'>
                        <section className='w-full md:w-2/3 mt-5'>
                            <TextField
                                className='w-full'
                                error={errors && !!errors?.email}
                                id={'email'}
                                // defaultValue={userIdentity?.email}
                                value={enteredInput?.email}
                                name={'email'} 
                                label='email'
                                type={'email'}
                                onChange={(e) => handleGeneralUserInput('email', e.target.value)}
                                onBlur={(e) => inputBlurHandle('email', e.target.value, setEnteredInputIsInvalid)}
                                variant="outlined"
                            />
                        </section>
                        <section className='w-full md:w-2/3'>
                            <MuiTelInput
                                className='w-full lg:w-full'
                                id={'phone_number'}
                                label={'PhoneNumber'}
                                onChange={onPhoneChanged}
                                // onChange={(e) => handleGeneralUserInput('phone_number', e.target.value)}
                                onBlur={(e) => inputBlurHandle('phone_number', e.target.value, setEnteredInputIsInvalid)}
                                value={phoneNumber}
                            />
                        </section>
                        <section className='flex w-full justify-center'>
                            <button className="w-2/3 lg:w-1/2 py-3 mt-10 bg-[#063970] rounded-md
                                    font-medium text-white uppercase md:w-4/5
                                    focus:outline-none hover:shadow-none hover:bg-[#4a8add]"
                                >
                                    Save Changes
                            </button>
                        </section>
                    </section>
                </>}

                
            </Form>
        </>
    )
}
