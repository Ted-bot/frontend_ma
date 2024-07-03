import {useEffect, useState} from 'react'
import { Form } from "react-router-dom"
import AddressInterface from "../../interface/AddressInterface.jsx"
import { setLocalStorageItem } from '../../../js/util/postUtil.js'
import { GetState, GetCity } from "react-country-state-city"

const inputValidList = {
    unitNumber: false,
    streetNumber: false,
    addressLine: false,
    city: false,
    region: false,
    postalCode: false,
    state:false,
    city:false,
    // countryId: false,
}

const AddressForm = () => {

    const addressStorageName = 'user_address'
    const countryid = 156
    const typeLocation = 'location'
    const prepRequestFields = {
        unitNumber: '',
        streetNumber: '',
        addressLine: '',
        city: '',
        region: '',
        postalCode: '',
        state:'',
        city_id:'',
        city_list_nr:'',
        countryId: countryid
    }
    
    const regexSearch = /^[A-Za-z]+$/
    const regexDigitSearch = /^[d+]+$/
    const formAddress = getUserAddressObjOrStorageData(addressStorageName)
    const [enteredInput, setEnteredInput] = useState(formAddress)
    // const [enteredInput, setEnteredInput] = useState(getNewUserObjOrStorageData(nameStorageItem))
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

        }
    }, [singleRequest])


    function getUserAddressObjOrStorageData(name){
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
        
        console.log({identifier, event: event?.target?.value})
        if(identifier == 'state')
            {
                const state = stateList[event?.target?.value]; //here you will get full state object.
                updateEnteredInputState('state_list_nr', event?.target?.value)
                updateEnteredInputState('state_id', state.id)       
                updateEnteredInputState(identifier, state.name)
                GetCity(countryid,state.id).then((result) => {
                    console.log({cityResults: result})
                    setCityList(result)
                })
                return
            }
            
        if(identifier == 'city')
            {
                console.log({cityList})
                const city = cityList[event?.target?.value]
                console.log({cityIndentifier: city})
                updateEnteredInputState('city_list_nr', event?.target?.value)
                updateEnteredInputState('city_id', city.id)
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
        // updateEnteredInputState(identifier, event)
        if(identifier != undefined && event != ''){
            console.log({check: 'enterIfCheck',identifier, event: event?.target?.value})
            updateEnteredInputState(identifier, event?.target?.value)
        }              
    }
            
    function inputBlurHandle(identifier, event, type='text') {
        
        console.log({identifier, event})
        console.log({textInputStreetNumber:Number.isInteger(Number(event))})
        
        if(type == 'text')
            {
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : regexSearch.test(event) ? false : true
                }))
            }

        if(type == 'number')
            {
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : Number.isInteger(Number(event)) ? false : true
                }))
            }
            
    }
    
    const addressForm = {
        name: 'Address',
        fields : [
            {name: 'unitNumber', id: 'unit_number', type: 'text', placeholder: 'unit number', value: enteredInput.unitNumber, invalid: enteredInputIsInvalid.unitNumber, error: 'error', required : true, onChange: (e) => inputHandle('unitNumber', e), onBlur: (e) => inputBlurHandle('unitNumber', e)},
            {name: 'streetNumber', id: 'street_number', type: 'number', placeholder: 'street number', min: 0, value: enteredInput.streetNumber, invalid: enteredInputIsInvalid.streetNumber, error: 'error', required : true, onChange: (e) => inputHandle('streetNumber', e), onBlur: (e) => inputBlurHandle('streetNumber', e)},
            {name: 'addressLine', id: 'address_line', type: 'text', placeholder: 'address line', value: enteredInput.addressLine, invalid: enteredInputIsInvalid.addressLine, error: 'error', required : true, onChange: (e) => inputHandle('addressLine', e), onBlur: (e) => inputBlurHandle('addressLine', e)},
            // {name: 'region', id: 'region', type: 'text', placeholder: 'region', value: enteredInput.region, invalid: enteredInputIsInvalid.region, error: 'error', required : true, onChange: (e) => inputHandle('region', e.target.value), onBlur: (e) => inputBlurHandle('region', e.target.value)},
            {name: 'postalCode', id: 'postal_code', type: 'text', placeholder: 'postal code', value: enteredInput.postalCode, invalid: enteredInputIsInvalid.postalCode, error: 'error', required : true, onChange: (e) => inputHandle('postalCode', e), onBlur: (e) => inputBlurHandle('postalCode', e)},
            // {name: 'countryId', id: 'country_id', type: 'text', placeholder: 'country', value: enteredInput.countryId, invalid: enteredInputIsInvalid.countryId, error: 'error', required : true, onChange: (e) => inputHandle('countryId', e.target.value), onBlur: (e) => inputBlurHandle('countryId', e.target.value)},
            { name: 'Location', id: 'location', type: typeLocation, value: enteredInput.city, cityList, stateList, stateId: enteredInput.state_id, invalid: enteredInputIsInvalid.city, required:true , onChangeState: (e) => inputHandle('state', e), onChangeCity: (e) => inputHandle('city', e), onBlur : (e) => inputBlurHandle('city', e)},
        ],
    }

    setLocalStorageItem(addressStorageName,enteredInput)
    
    console.log({enteredInputIsInvalid: enteredInputIsInvalid})
    
    return (
        <>
        <section className="flex flex-col shadow-md bg-slate-100 py-5 rounded-md px-3 sm:mx-4 w-full sm:px-5 sm:w-4/5 md:px-3 md:shadow-xl">
            <section>
                <h1 className={`flex justify-center pt-3 pb-6 text-2xl`}>{addressForm.name}</h1>
            </section>
            <form action="" name='address' id='address'>
                <AddressInterface array={addressForm.fields} />
            </form>
        </section>
    </>
    )
}


export default AddressForm