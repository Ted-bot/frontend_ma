import { useState, useEffect, useCallback, useRef } from 'react'
import { 
    ApiFetchGetOptions,
    ApiFetchPostOptions,
    ApiFetch,
    setLocalStorageItem,
    getToken
 } from "../../js/util/postUtil"
import { useLoaderData } from 'react-router-dom'

 import UserDataModal from '../../components/modal/UserDataModal'
 import UserChoosePaymentModal from '../../components/modal/UserChoosePaymentModal'

import UserOrderInfoForm from "../../components/forms/client/UserOrderInfoForm"
import SelectedOrderForPaymentInterface from '../../components/interface/SelectedOrderForPaymentInterface'

import { getLocalStorageItem } from '../../js/util/postUtil'
import { alpha } from "@mui/material"
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import { GetState, GetCity } from "react-country-state-city"
import UserSelectPaymentMethodForm from '../../components/forms/client/UserSelectPaymentMethodForm'

import { OrderContext } from '../../store/shop-order-context'

const countryid = 156
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
    countryId: countryid
}

const PaymentPage = () => {

    const addressStorageName = 'user_address'

    const data = useLoaderData()
    const [paymentType, setPaymentType] = useState({
        ideal : false,
        credit_card : false,
        pay_pal : false,
    })    

    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    
    const [stateList, setStateList] = useState([]) 
    const [cityList, setCityList] = useState([])
    
    const getSelectedPaymentMethodIcon = (obj) => Object.keys(obj).find((i) => obj[i] === 'true')
    
    const userFormInfo = getUserInfoObjOrStorageData(addressStorageName)
    const [enteredInput, setEnteredInput] = useState(userFormInfo)
    const [symbol, setSymbol] = useState(null)
    
    const dialogUserAddress = useRef()
    const dialogUserPaymentMethod = useRef()
    const token = getToken()
    const [currencyType, setCurrencyType] = useState('EUR')
    const [userData, setUserData] = useState({
        userInfo: {},
        userAddress: {},
        userOrder: {},
    })
    
    const paymentCurrency = getLocalStorageItem(currencyType)

    function updateUserData(identifier, data){
        if(identifier == 'userData')
        {return}

        setUserData((prevState) => ({
            ...prevState,
            [identifier]: data
            }
        )
    )}

    useEffect(() => {
        ApiRequest()

        GetState(countryid).then((result) => {
            setStateList(result)
        })           

        GetCity(countryid, Number(userData.userAddress.reactStateNr)).then((result) => {
            setCityList(result)
        })

        setEnteredInput((prevValue) => ({
            ...prevValue,
            ['city_id']: Number(userData.userAddress.reactCityNr)
        }))
        
        setEnteredInput((prevValue) => ({
            ...prevValue,
            ['state_id']: Number(userData.userAddress.reactStateNr)
        }))

        //set user data in local storage to keep most recent data

        Object.keys(userData.userInfo).forEach(key => {
            const value = userData.userInfo[key]
            setEnteredInput((prevValue) => ({
                ...prevValue,
                [key]: value
            }))
        })

        Object.keys(userData.userAddress).forEach(key => {
            const value = userData.userAddress[key]
            setEnteredInput((prevValue) => ({
                ...prevValue,
                [key]: value
            }))
        })

    }, [userData.userAddress.reactStateNr])

    useEffect(() => {
        setLocalStorageItem(addressStorageName,enteredInput)
    }
    ,[enteredInput])
    
    function checkLocationStatus(id){
        setEnteredInputIsInvalid((prevValues) => ({
            ...prevValues,
            [id] : false})
        )
    }
    
    function getUserInfoObjOrStorageData(name){
        const storedValues = localStorage.getItem(name)
        
        if(!storedValues){
            return prepRequestFields
        }
        
        return JSON.parse(storedValues) 
    }    
    
    const [nameType, setNameType] = useState('no payment method selected')
    
    const inputHandle = (identifier, event) => {
        event.preventDefault()
        
        Object.keys(paymentMethodOptions.fields).forEach(key => {
            const value = paymentMethodOptions.fields[key]
            if(value.id == identifier){
                setNameType(value.name)
            }
        })

        setPaymentType((prevValues) => ({
            [identifier]: true
        }))
    }

    const paymentMethodOptions = {
        name: 'payment_method',
        fields : [
            {
                name: 'iDEAL', 
                id: 'ideal', 
                type: 'text', 
                value: paymentType.ideal, 
                onClick: (e) => inputHandle('ideal', e), 
            },
            {
                name: 'CreditCard', 
                id: 'credit_card', 
                type: 'text', 
                value: paymentType.credit_card, 
                onClick: (e) => inputHandle('credit_card', e), 
            },
            {
                name: 'PayPal', 
                id: 'pay_pal', 
                type: 'text', 
                value: paymentType.pay_pal, 
                onClick: (e) => inputHandle('pay_pal', e), 
            }
        ]
    }
    
    const ApiRequest = async () => {
        const response = data        
        
        if(!response.lines){
            console.log({ apiResponseError : response})
            throw new {error: 'Not Found!'}
        }

        setLocalStorageItem(response.curreny.name,response.curreny.symbol)
        
        updateUserData('userInfo', {...response.user})
        updateUserData('userAddress', {...response.address})
        updateUserData('userOrder', 
        {
            orderId: response.orderId,
            currency: response.currency,
            lastOrder: response.lines,
            orderTaxPrice: response.orderTaxPrice,
            orderTotalAmount: response.amount.value,
            orderTotalProductPrice: response.orderTotalProductPrice,
        })
    }
    
    const userAddressModalHandler = useCallback(
        (event) =>  { 
            dialogUserAddress.current.open()
        }
    )

    // const closeUserAddressModalHandler = (event) =>  {
    //         console.log({event, ref: dialogUserAddress.current})
    //         dialogUserAddress.current.close()
    //     }

    const paymentMethodModalHandler = useCallback(
        (event) => {
            dialogUserPaymentMethod.current.open()
        }
    )

    const choosePaymentFormSub = useCallback(
        (event) => {
            const options = {
                [event.target[0].id]: event.target[0].value,
                [event.target[1].id]: event.target[1].value,
                [event.target[2].id]: event.target[2].value
            }

            event.preventDefault()
            const selectedMethod = getSelectedPaymentMethodIcon(options)
            setSymbol(selectedMethod)
        }
    )


    const userAddressHandler = async (event) => {
        event.preventDefault()

        let userAddressInfo = {}
        let cityName = ''
        let stateName = ''

        for (let i = 0; i < 9; i++){
            if(event.target[i].id == 'location'){
                const city = ctxValue.availableCities.find((city) => city.id == Number(event.target[i].value) )
                //if city not found ?? set invalid input field
                console.log({API_CITY: event.target[i].value == ''})
                if(event.target[i].value == '' || event.target[i].value == undefined){
                    setEnteredInputIsInvalid((prevValues) => ({
                        ...prevValues,
                        [event.target[i].id] : true})
                    )
                    return
                }

                checkLocationStatus(event.target[i].id)

                cityName = city.name
            }

            if(event.target[i].id == 'stateLocation')
            {
                const state = ctxValue.availableStates.find((state) => state.id == Number(event.target[i].value) )
                stateName = state.name
                continue
            }

            userAddressInfo = { ...userAddressInfo, [event.target[i].id]: event.target[i].value}
        }

        userAddressInfo = { ...userAddressInfo, ['location']: cityName}
        userAddressInfo = { ...userAddressInfo, ['region']: stateName}
        userAddressInfo = { ...userAddressInfo, ['reactStateNr']: ctxValue.currentUserState.toString()}
        userAddressInfo = { ...userAddressInfo, ['reactCityNr']: ctxValue.currentUserCity.toString()}

        console.log({formAddress: userAddressInfo})

        const options = { url: '/api/v1/order/address', method: 'POST'}
        const ApiOptions = ApiFetchPostOptions(options, userAddressInfo, {'X-Authorization': 'Bearer ' + token})            

        try {
            const response = await ApiFetch(ApiOptions)
            const getResults = await getResults.json()
        
            if(!response.ok)
            { //if(response.status >= 400 && response.status <= 600)
                // const errorJson = await response.json()
                throw new PostError('Api error send order address error!', getResults)
            }

            // setOnClose(true)
            // closeUserAddressModalHandler()
        //     deleteLocalStorageItem(nameStorageItem)
        //     const reqResults = await response.json()
        //     setToken(reqResults)
        //     navigate('/dashboard') 
        //     // redirect
        // localStorage.removeItem(addressStorageName);

        } catch (error) {
            
            console.log({API_updateUserOrder:error})

        }
    }

    function updateEnteredInputState(identifier, value){
        setEnteredInput((prevValues) => {
            return {
                ...prevValues,
                [identifier]: value
            }
        })
    }

    const handleUserSelectLocation = (identifier, event) => {
        if(identifier == 'state')
            {
                const state = stateList.find((state) => state.id == Number(event.target.value)); //here you will get full state object.
                updateEnteredInputState('state_id', state.id)       
                updateEnteredInputState(identifier, state.name)
                GetCity(countryid, state.id).then((result) => {
                    setCityList(result)
                })
                return
            }
            
        if(identifier == 'city')
            {
                const city = cityList.find((city) => city.id == Number(event.target.value))
                updateEnteredInputState('city_id', city.id)
                updateEnteredInputState(identifier, city.name)
                checkLocationStatus('location')
                return
            }
    
        if(identifier == 'streetNumber')
            {
                const convertStrToInt = Number(event.target.value)
                const checkIfNumber = typeof convertStrToInt == 'number'
                
                if(!checkIfNumber){
                    setEnteredInputIsInvalid((prevValues) => ({
                        ...prevValues,
                        [identifier] : true
                    }))
                    return
                } else {

                    updateEnteredInputState(identifier, event.target.value)
                    return

                }                
            }
        
        if(identifier == 'phoneNumber')
            {
                console.log({phoneNumber:event})
                updateEnteredInputState(identifier, event)
                return
            }    
        
        if(identifier != undefined && event != '')
            {
                updateEnteredInputState(identifier, event.target.value)
            }
    }

    function inputBlurHandle(identifier, event, type='text') {
        if(identifier == 'unitNumber'){
            return
        }

        if(type == 'text' || type == 'number')
            {
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : event.target.value != '' ? false : true
                }))
                return
            }  

        setEnteredInputIsInvalid((prevValues) => ({
            ...prevValues,
            [identifier] : (event.target.value == '') ? true : false
        }))
            
    }

    const ctxValue = {
        availableStates: stateList,
        availableCities: cityList,
        currentUserState: enteredInput.state_id,
        currentUserCity: enteredInput.city_id,
        userSelectedLocation: handleUserSelectLocation,
        onBlur: inputBlurHandle,
    }

    console.log({enteredInputIsInvalid})
    return (
        <>
            <OrderContext.Provider value={ctxValue}>
                {userData?.userAddress?.reactStateNr != undefined && 
                <UserDataModal 
                    ref={dialogUserAddress} 
                    enteredInput={enteredInput} 
                    formSubmit={userAddressHandler} 
                    user={userData.userInfo} 
                    address={userData.userAddress}
                    addressStorageName={addressStorageName}
                    enteredInputIsInvalid={enteredInputIsInvalid}
                />
                }
                <UserChoosePaymentModal ref={dialogUserPaymentMethod} formAction={choosePaymentFormSub} paymentMethodOptions={paymentMethodOptions} />

                <section className="flex-col shadow-md w-full bg-slate-100 py-5 rounded-md px-3 sm:mx-2 sm:px-5 md:grid md:mx-2 md:shadow-xl">

                    <h1 className={`pt-3 pb-6 mt-12 text-2xl text-center`}>Address & Peronsal Information</h1>
                    {userData?.userInfo && userData?.userAddress && <UserOrderInfoForm userAddressModalHandler={userAddressModalHandler} user={userData.userInfo} address={userData.userAddress} />}

                    <h1 className={`pt-3 pb-6 mt-8 text-2xl text-center`}>Choose Payment Method</h1>
                    <UserSelectPaymentMethodForm symbol={symbol} paymentMethodModalHandler={paymentMethodModalHandler} paymentMethodOptions={paymentMethodOptions.fields} selectedType={nameType} />

                    <h1 className={`pt-3 pb-6 mt-8 text-2xl text-center`}>Order</h1>
                    { userData.userOrder?.lastOrder != undefined && <SelectedOrderForPaymentInterface latestOrder={userData.userOrder.lastOrder} />}
                    
                    <section>
                        <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)' }}>
                            <Grid 
                                container 
                                direction="row"
                                sx={{ display: 'flex'}}
                            >
                                <Box sx={{ paddingLeft: '1.2rem' }}>
                                    <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">price : </section>
                                </Box>
                                <Box sx={{ marginRight: '0px', marginLeft: 'auto', paddingRight: '1.2rem' }}>
                                    <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">{paymentCurrency} {userData?.userInfo?.orderTotalProductPrice}</section>
                                </Box>
                            </Grid>
                            <Grid
                                container 
                                direction="row"
                                sx={{ flexGrow: 1}}
                            >
                                <Box sx={{ paddingLeft: '1.2rem' }}>
                                    <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">tax (9%): </section>
                                </Box>
                                <Box sx={{ marginRight: '0px', marginLeft: 'auto', paddingRight: '1.2rem' }}>
                                    <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">{paymentCurrency} {userData?.userInfo?.orderTaxPrice}</section>
                                </Box>
                            </Grid>

                            <Divider sx={{marginRight: '1.2rem', marginLeft: '1.2rem' , borderBottomWidth: 5, marginTop: 2, marginBottom: 1, backgroundColor: alpha('#90caf9', 0.5) }} />

                            <Grid
                                container 
                                direction="row"
                                sx={{ flexGrow: 1}}
                            >
                                <Box sx={{ paddingLeft: '1.2rem' }}>
                                    <section className="font-bold text-blue-600/80 sm:text-lg md:text-xl">Total Amount : </section>
                                </Box>
                                <Box sx={{ marginRight: '0px', marginLeft: 'auto', paddingRight: '1.2rem' }}>
                                    <section className="font-bold text-blue-600/80 sm:text-lg md:text-xl">{paymentCurrency} {userData?.orderTotalAmount}</section>
                                </Box>
                            </Grid>
                        </Box>
                    </section>
                    
                </section>
            </OrderContext.Provider>
        </>
    )
}

export default PaymentPage