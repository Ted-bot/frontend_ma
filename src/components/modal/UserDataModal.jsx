import { useEffect, useState, forwardRef, useImperativeHandle, useRef, useContext } from 'react'
import { createPortal } from 'react-dom'
import Divider from '@mui/material/Divider'

import UserOrderInfoInterface from '../interface/UserOrderInfoInterface'
import { GetState, GetCity } from "react-country-state-city"
import { setLocalStorageItem } from '../../js/util/postUtil'

import {OrderContext} from '../../store/shop-order-context'

import './CalendarModal.css'
import { alpha } from "@mui/material"

const inputValidList = {
    firstAndLastName: false,
    email: false,
    phoneNumber: false,
    streetNumber: false,
    unitNumber: false,
    addressLine: false,
    city: false,
    region: false,
    postalCode: false,
    state: false,
    city: false,
    // countryId: false,
}

const UserDataModal = forwardRef(function UserDataModal({ formSubmit, user, address}, ref){

    useContext(OrderContext)

    const dialog = useRef()
    const addressStorageName = 'user_address'
    const countryid = 156
    const typeLocation = 'location'
    const prepRequestFields = {
        firstAndLastName:'',
        email:'',
        phoneNumber:'',
        unitNumber: '',
        streetNumber: '',
        addressLine: '',
        city: '',
        region: '',
        postalCode: '',
        state:'',
        city_id:'',
        state_id:'',
        city_list_nr:'',
        countryId: countryid
    }
    
    const regexSearch = /^[A-Za-z]+$/
    const regexDigitSearch = /^[d+]+$/
    const userFormInfo = getUserInfoObjOrStorageData(addressStorageName)
    const [enteredInput, setEnteredInput] = useState(userFormInfo)
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)

    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [singleRequest, setSingleRequest] = useState(true)
 
    useEffect(() => {
        if(singleRequest){
            setSingleRequest(false)
            GetState(countryid).then((result) => {
                setStateList(result)
            })           

            GetCity(countryid, Number(address.reactStateNr)).then((result) => {
                console.log({cityResults: result})
                setCityList(result)
            })

            setEnteredInput((prevValue) => ({
                ...prevValue,
                ['city_id']: Number(address.reactCityNr)
            }))
            
            setEnteredInput((prevValue) => ({
                ...prevValue,
                ['state_id']: Number(address.reactStateNr)
            }))
        }        

    }, [])

    function getUserInfoObjOrStorageData(name){
        const storedValues = localStorage.getItem(name)
    
        if(!storedValues){
            return prepRequestFields
        }
    
        return JSON.parse(storedValues) 
    }

    function updateEnteredInputState(identifier, value){
        setEnteredInput((prevValues) => {
            return {
                ...prevValues,
                [identifier]: value
            }
        })
    }

    function inputHandle(identifier, event){

        if(identifier == 'state')
            {
                const state = stateList.find((element) => element.id == Number(event.target.value)); //here you will get full state object.
                updateEnteredInputState('state_list_nr', event?.target?.value)
                updateEnteredInputState('state_id', state.id)       
                updateEnteredInputState(identifier, state?.name)
                GetCity(countryid, state.id).then((result) => {
                    console.log({cityResults: result})
                    setCityList(result)
                })
                return
            }
            
        if(identifier == 'city')
            {
                console.log({cityList})
                const city = cityList[event?.target?.value]
                console.log({testCityList:city})
                console.log({cityIndentifier: city})
                updateEnteredInputState('city_list_nr', event?.target?.value)
                updateEnteredInputState('city_id', city?.id)
                updateEnteredInputState(identifier, city?.name)
                return
            }

        if(identifier == 'streetNumber')
            {
                const convertStrToInt = Number(event?.target?.value)
                const checkIfNumber = typeof convertStrToInt == 'number'
                
                if(!checkIfNumber){
                    setEnteredInputIsInvalid((prevValues) => ({
                        ...prevValues,
                        [identifier] : false
                    }))
                    return
                } else {
                    updateEnteredInputState(identifier, event?.target?.value)
                    return

                }                
            }

        if(identifier != undefined && event != '')
            {
                console.log({check: 'enterIfCheck',identifier, event: event?.target?.value})
                updateEnteredInputState(identifier, event?.target?.value)
            }              
    }
            
    function inputBlurHandle(identifier, event, type='text') {
        if(identifier == 'unitNumber'){
            return
        }

        if(type == 'text')
            {
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : regexSearch.test(event.target.value) ? false : true
                }))
                return
            }

        if(type == 'number')
            {
                console.log({isNumber: event.target.value})
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : Number.isInteger(Number(event.target.value)) ? false : true
                }))
                return
            }            

        setEnteredInputIsInvalid((prevValues) => ({
            ...prevValues,
            [identifier] : (event.target.value == '') ? true : false
        }))
            
    }

    const userForm = {
        name: 'Personal Information',
        fields : [
            {
                name: 'First- and LastName', 
                id: 'FirstAndLastName', 
                type: 'text', 
                placeholder: 'type first and last name', 
                value: user?.firstAndLastName ? user.firstAndLastName : enteredInput.firstAndLastName, 
                invalid: enteredInputIsInvalid.firstAndLastName, 
                error: 'error', 
                required : true, 
                onChange: (e) => inputHandle('firstAndLastName', e), 
                onBlur: (e) => inputBlurHandle('firstAndLastName', e)
            },
            {
                name: 'E-mail', 
                id: 'Email', 
                type: 'email', 
                placeholder: 'email', 
                autoComplete: 'email',
                value: user?.email ? user?.email : enteredInput.email, 
                invalid: enteredInputIsInvalid.email, 
                error: 'error', 
                required : true, 
                onChange: (e) => inputHandle('email', e), 
                onBlur: (e) => inputBlurHandle('email', e)},
            {
                name: 'Phone Number', 
                id: 'PhoneNumber', 
                type: 'tel', 
                placeholder: 'type phone number', 
                value: user?.phoneNumber ? user?.phoneNumber : enteredInput.phoneNumber, 
                invalid: enteredInputIsInvalid.phoneNumber, 
                error: 'error', 
                required : true, 
                onChange: (e) => inputHandle('phoneNumber', e), 
                onBlur: (e) => inputBlurHandle('phoneNumber', e)
            },
        ],
    }
    
    const addressForm = {
        name: 'Address',
        fields : [
            {
                name: 'Unit Number',
                id: 'UnitNumber',
                type: 'text',
                placeholder: 'unit number',
                value: address.unitNumber ? address.unitNumber : enteredInput.unitNumber,
                invalid: enteredInputIsInvalid.unitNumber,
                error: 'error',
                onChange: (e) => inputHandle('unitNumber', e),
                onBlur: (e) => inputBlurHandle('unitNumber', e)},
            {
                name: 'Street Number',
                id: 'StreetNumber',
                type: 'number',
                placeholder: 'street number',
                min: 0, 
                value: address.streetNumber ? address.streetNumber : enteredInput.streetNumber,
                invalid: enteredInputIsInvalid.streetNumber,
                error: 'error',
                required : true,
                onChange: (e) => inputHandle('streetNumber', e), onBlur: (e) => inputBlurHandle('streetNumber', e)},
            {
                name: 'Street Name',
                id: 'AddressLine',
                type: 'text',
                placeholder: 'address line',
                value: address.streetName ? address.streetName : enteredInput.addressLine,
                invalid: enteredInputIsInvalid.addressLine,
                error: 'error',
                equired : true,
                onChange: (e) => inputHandle('addressLine', e),
                onBlur: (e) => inputBlurHandle('addressLine', e)},
            {
                name: 'Postal Code',
                id: 'PostalCode',
                type: 'text',
                placeholder: 'postal code',
                value: address.postalCode ? address.postalCode : enteredInput.postalCode,
                invalid: enteredInputIsInvalid.postalCode,
                error: 'error',
                equired : true, onChange: (e) => inputHandle('postalCode', e),
                onBlur: (e) => inputBlurHandle('postalCode', e)
            },
            {
                name: 'Location',
                id: 'Location',
                type: typeLocation, 
                value: enteredInput.city, 
                defaultValueCity: address.reactCityNr ? address.reactCityNr : enteredInput.city_id,
                defaultValueState: address.reactStateNr ? address.reactStateNr : enteredInput.state_id,
                cityList, 
                stateList,
                invalid: enteredInputIsInvalid.city,
                required:true,
                onChangeState: (e) => inputHandle('state', e),
                onChangeCity: (e) => inputHandle('city', e),
                onBlur : (e) => inputBlurHandle('city', e)
            },
        ],
    }

    setLocalStorageItem(addressStorageName,enteredInput)
    // let setTypeEvent

    useImperativeHandle(ref, () => {

        return {
            open(){
                dialog.current.showModal()
            }
        }
    })
    
    return createPortal(
        <dialog ref={dialog} className="result-modal">
            <section>
                <form
                    method="dialog" 
                    className="flex w-4 float-right justify-end"
                >
                    <button className='px-2 rounded-md hover:border-2 hover:border-rose-500 hover:bg-rose-300'>X</button>
                </form>
                <form 
                    // onSubmit={(e) => formAction(e)}
                    onSubmit={(e) => formSubmit(e)}
                    name='address'
                    id='address'
                >
                    <section>
                        <h1 className={`flex justify-center pt-3 pb-6 text-2xl`}>{userForm?.name}</h1>
                        {userForm && <UserOrderInfoInterface array={userForm.fields} />}
                    </section>
                    <Divider sx={{marginRight: '1.2rem', marginLeft: '1.2rem' , borderBottomWidth: 2, marginTop: 2, marginBottom: 1, backgroundColor: alpha('#90caf9', 0.8) }} />
                    <section>
                        <h1 className={`flex justify-center pt-3 pb-6 text-2xl`}>{addressForm?.name}</h1>
                        {userForm && <UserOrderInfoInterface array={addressForm.fields} />}
                    </section>
                    <button 
                            className="text-slate-100 h-16 w-42 mt-8 px-8 align-content-center w-full rounded-b-full text-2xl rounded-t-full border-0 ring-2 shadow-xl ring-red-500 bg-red-500 bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300 hover:from-orange-400 hover:text-yellow-200 hover:to-red-400 hover:ring-red-400 hover:shadow-2xl"
                        >
                            Done
                        </button>
                </form>
            </section>
        </dialog>,
        document.getElementById("modal")
    )
})

export default UserDataModal