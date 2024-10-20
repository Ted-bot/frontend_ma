import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form } from 'react-router-dom'

import { storageNameModifyUser, inputValidList } from '../../../js/util/auth.js'
import { useUserFormContext } from '../../../store/user-form-context.jsx'
import { getNewUserObjOrStorageData } from '../../../js/util/postUtil.js'
import CreateFormInterface from '../CreateFormInterface.jsx'
import { getAvailableLocations, getUserProfile, userActions, sendUpdatedUser } from '../../../store/features/users/userSlice.jsx' //, 
import { inputBlurHandle } from '../../class/userData/FormHelper.jsx'
import { usePostUsersQuery } from '../../../store/features/api/apiSlice.jsx'

export const ProfileTabInterface = () => {    
    const typeText = 'text'
    const typePhone = 'tel'
    const typeLocation = 'location'
    const { data: usersApiRTK, isFetching,isLoading, isSuccess } = usePostUsersQuery(1)
    let data 
    let InterfaceConfiguration = {
        setItems: []
    }

    const [enteredInput, setEnteredInput] = useState(getNewUserObjOrStorageData(storageNameModifyUser))
    const [errors, setErrors] = useState(inputValidList)
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    const [buttonPressed, setButtonPressed] = useState(false)
    const [test, setTest] = useState(false)
    
    const {state, dispatch} = useUserFormContext()
    const reduxDispatch = useDispatch()
    // const user = useSelector((state) => state.usersApiRTK)
    // const {city_list:cityList, state_list: stateList, email, phone_number} = user
    let stateSelected = {id:2612}
    
    //

    const getLocations = async (id) => {
        await reduxDispatch(getAvailableLocations(id))
    }
    

    useEffect(() => { 
        getLocations(stateSelected.id)
        // reduxDispatch(getAvailableLocations(stateSelected.id))
        // reduxDispatch(getUserProfile())
        loadPageData()
        
        console.log({newData: data})
        if(isSuccess){
            // setProfileData(data)   

            InterfaceConfiguration = {
                buttonname: 'Save Changes',
                setItems : [ 
                    //, defaultValue: usersApiRTK.email ,
                    { name: 'Email', id: 'email', type: typeText, placeholder: 'email', value: enteredInput?.email, defaultValue: data?.email, error: errors.email, invalid: enteredInputIsInvalid.email, autoComplete: 'email', onChange: (e) => handleGeneralUserInput('email', e.target.value), onBlur : (e) => inputBlurHandle('email', e.target.value, setEnteredInputIsInvalid)},
                    // , defaultValue: phone_number
                    { name: 'PhoneNumber', id: 'phone_number', type: typePhone, placeholder: 'phone number', defaultValue: data?.phone_number, value: enteredInput?.phone_number, error: errors.phone_number, invalid: enteredInputIsInvalid.phone_number, onChange: (value) => handleGeneralUserInput('phone_number', value), onBlur : (e) => inputBlurHandle('phone_number', e.target.value, setEnteredInputIsInvalid)},
                    ]
            }
            setTest(InterfaceConfiguration)
            console.log({CheckReceivesData: InterfaceConfiguration.setItems})
        } 
        

        
        // const profileData = {
        //     email: usersApiRTK.email,
        //     phone_number: usersApiRTKphone_number
        // }
           
        setButtonPressed(true)
}, [isSuccess])

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

    let content
    const loadPageData = () => {
        
        // Show loading states based on the hook status flags
        if (isLoading) {
            console.log({RTKisLoading: 'Loading Data'})
            return content = <p>Loading...</p> //<Spinner text="Loading..." />]
        } else if (isSuccess) {
            data = {
                email: usersApiRTK.email,
                phone_number: usersApiRTK.phoneNumber
            }
            setProfileData(data)       
            console.log({RTKisSuccess: usersApiRTK})
            // console.log({RTKisLoading: 'Succes Data'})
            InterfaceConfiguration = {
                buttonname: 'Save Changes',
                setItems : [ 
                    //, defaultValue: usersApiRTK.email ,
                    { name: 'Email', id: 'email', type: typeText, placeholder: 'email', value: enteredInput?.email, defaultValue: data?.email, error: errors.email, invalid: enteredInputIsInvalid.email, autoComplete: 'email', onChange: (e) => handleGeneralUserInput('email', e.target.value), onBlur : (e) => inputBlurHandle('email', e.target.value, setEnteredInputIsInvalid)},
                    // , defaultValue: phone_number
                    { name: 'PhoneNumber', id: 'phone_number', type: typePhone, placeholder: 'phone number', defaultValue: data?.phone_number, value: enteredInput?.phone_number, error: errors.phone_number, invalid: enteredInputIsInvalid.phone_number, onChange: (value) => handleGeneralUserInput('phone_number', value), onBlur : (e) => inputBlurHandle('phone_number', e.target.value, setEnteredInputIsInvalid)},
                    ]
            }
            // return content = InterfaceConfiguration
            // setButtonPressed(true)
            // content = users.map(post => <PostExcerpt key={post.id} post={post} />)
        } else if (isError) {
            console.log({RTKisLoading: 'FAiled Data'})
            return content = <div>{error.toString()}</div>
        }
    }

    

    console.log({dataReceived: data?.phone_number, enteredInput})
    console.log({isSuccess, data: InterfaceConfiguration.setItems.length})
    

    return(
        <>
            <Form onSubmit={handleSubmit} className='flex-col md:justify-item-center' >
                {/* {isSuccess && <p>Hallo</p>} */}
                {test && test?.setItems.length != 0 && <CreateFormInterface array={test.setItems} />}
                <h1>loadPageDataContent</h1>
                {content}
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