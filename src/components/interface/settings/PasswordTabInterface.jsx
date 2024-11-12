import { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { Form } from 'react-router-dom'
import { TextField } from '@mui/material'
import { inputBlurHandle } from '../../class/userData/FormHelper.jsx'
// import { useUpdatePasswordMutation } from '../../../store/features/api/apiSlice.jsx'
import { dataProvider } from '../../../dataProvider/main/DataProvider.jsx'
import { useGetIdentity, useNotify } from 'react-admin'
import { changeObjKeysToCamelCaseFields } from '../../../js/util/postUtil.js'
import classes from "../../cards/OrderCard.module.css"



export const PasswordTabInterface = () => {    
    let message = ''

    const typePassword = 'password'
    const passwordObj = {password: ''}

    const [enteredInput, setEnteredInput] = useState(passwordObj)
    const [errors, setErrors] = useState(passwordObj)
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(passwordObj)

    const {data: userIdentity = {email: ''}} = useGetIdentity()
    const notify = useNotify()

    const handleGeneralUserInput = (identifier, value) => {
        setEnteredInput((prevValues) => ({
            ...prevValues,
            [identifier]: value
        }))
    }

    let data = {}
    const handleSubmit = async (e) => {
        e.preventDefault()
        for (const [key, value] of Object.entries(e.target)){
            if(value.id === 'location' || value.id === 'region' || !value.id) continue
            data = {...data, [value.id]: value.value}
            if(message){
                message = value.id
            } else {
                message = message + ' ' + value.id                    
            }
        }

        const requestBody = changeObjKeysToCamelCaseFields(data)

        dataProvider.updateUserIdentity('user_by_email', userIdentity?.email,requestBody)
        .then(() => {
            notify(`Success updating ${message}`, { type: 'success' })
        }).catch((error) => {
            notify(`Failed updating ${message}`, { type: 'error' })
        })
    }

    return(
        <>

            <Form onSubmit={handleSubmit} className='flex-col' >
                <section className='flex-wrap justify-items-center mt-10'>
                    <TextField
                        className='w-full'
                        error={!!errors?.password}
                        id={'password'}
                        // defaultValue={defaultValue}
                        value={enteredInput?.password}
                        name={'password'} 
                        label={'new password'}
                        type={'password'}
                        onChange={(e) => handleGeneralUserInput('password', e.target.value)}
                        onBlur={(e) => inputBlurHandle('password', e.target.value, setEnteredInputIsInvalid)}
                        variant="outlined"
                        autoComplete='new-password'
                    />
                    <br />
                    <section className='flex w-full justify-center  mt-20'>
                            <button className="w-2/3 lg:w-1/2 py-3 bg-[#063970] rounded-md
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