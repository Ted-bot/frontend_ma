import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form } from 'react-router-dom'

import { storageNameModifyUser, inputValidList } from '../../../js/util/auth.js'
import { useUserFormContext } from '../../../store/user-form-context.jsx'
import { getNewUserObjOrStorageData } from '../../../js/util/postUtil.js'
import CreateFormInterface from '../CreateFormInterface.jsx'
import { getAvailableLocations, getUserProfile, userActions, sendUpdatedUser } from '../../../store/features/users/userSlice.jsx' //, 
import { inputBlurHandle } from '../../class/userData/FormHelper.jsx'

export const PasswordTabInterface = () => {    
    const typeText = 'text'

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
        // getLocations(stateSelected.id)
        // reduxDispatch(getAvailableLocations(stateSelected.id))
        // reduxDispatch(getUserProfile())
        
        // const profileData = {
        //     email: email,
        //     phone_number: phone_number
        // }
        // setProfileData(profileData)       
        setButtonPressed(true)
}, [buttonPressed])
    // }, [buttonPressed])

     
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
        reduxDispatch(userActions.updateUser(stateSelected.value))
    }

    const InterfaceConfiguration = {
        buttonname: 'Save Changes',
        setItems : [{ 
                name: 'Password', 
                id: 'password', 
                type: typeText, 
                placeholder: 'password',
                value: enteredInput?.email, 
                error: errors.email, 
                invalid: enteredInputIsInvalid.email, 
                autoComplete: 'password', 
                onChange: (e) => handleGeneralUserInput('password', e.target.value), 
                onBlur : (e) => inputBlurHandle('password', e.target.value, setEnteredInputIsInvalid)
            },
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