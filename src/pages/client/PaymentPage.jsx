import { useState, useEffect, useCallback, useRef } from 'react'
import { 
    ApiFetchGetOptions,
    ApiFetchPostOptions,
    ApiFetch,
    getLocalStorageItem,
    setLocalStorageItem,
    getToken,
    prepareInputForRequest,
    findAndUpdateInvalidList,
    findInvalidInput,
    setInputInvalidTrueWhenEnteredInputEmpty
 } from "../../js/util/postUtil"
import { useLoaderData, Form, useNavigate } from 'react-router-dom'

 import UserDataModal from '../../components/modal/UserDataModal'
 import UserChoosePaymentModal from '../../components/modal/UserChoosePaymentModal'

import UserOrderInfoForm from "../../components/forms/client/UserOrderInfoForm"
import SelectedOrderForPaymentInterface from '../../components/interface/SelectedOrderForPaymentInterface'

import { alpha, formControlClasses } from "@mui/material"
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
    // unitNumber: false,
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
    paymentMethodName:'no payment method selected!',
    paymentMethodId:'',
    countryId: countryid
}

const PaymentPage = () => {

    // const getError = getLocalStorageItem('error')
    // console.log({getError})
    // if(){
    //     redirect('/dashboard/login')            
    // }
    const addressStorageName = 'user_address'
    const data = useLoaderData()
    const navigate = useNavigate()
    const regexSearchText = /^[A-Za-z]+$/
    const regexSearchInt = /^\d+$/
    
    const [paymentType, setPaymentType] = useState({
        ideal : false,
        credit_card : false,
        pay_pal : false,
    })    

    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputValidList)
    const [lockedSubmitButton, setLockedSubmitButton] = useState(false)

    const [stateList, setStateList] = useState([]) 
    const [cityList, setCityList] = useState([])
    
    // const getSelectedPaymentMethodIcon = (obj) => Object.keys(obj).find((i) => obj[i] === 'true')
    
    const userFormInfo = getUserInfoObjOrStorageData(addressStorageName)
    const [enteredInput, setEnteredInput] = useState(userFormInfo)
    // const [symbol, setSymbol] = useState(null)
    
    const dialogUserAddress = useRef()
    const dialogUserPaymentMethod = useRef()
    const token = getToken()
    const [currencyType, setCurrencyType] = useState('EUR')
    const [userData, setUserData] = useState({
        userInfo: {},
        userAddress: {},
        userOrder: {},
    })
    const [errors, setErrors] = useState({
        userAddress: {},
    })
    
    const paymentCurrency = getLocalStorageItem(currencyType)

    function updateUserData(identifier, data){
        setUserData((prevState) => ({
            ...prevState,
            [identifier]: data
            }
        )
    )}
    
    function updateErrors(identifier, data){

        setErrors((prevState) => ({
            ...prevState,
            [identifier]: data
            }
        )
    )}

    useEffect(() => {
        ApiRequest()

        console.log({userData})

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

        console.log({'address_user': data.address})
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
        
        if(!userData.userAddress.id){
            const { id, firstAndLastName, email, phoneNumber, unitNumber, reactStateNr, reactCityNr, region, state, ...desctrInvalidList} = userFormInfo 
            
            for (const [key, value] of Object.entries(desctrInvalidList)) {
                if(!value){
                    setInvalidTypeStatus(key, true)
                }
            }
        }
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
    
    const inputHandlePaymentMethod = (identifier, event) => {
        event.preventDefault()

        // console.log({passesThrough})
        const checkInputUser = findAndUpdateInvalidList(enteredInput, setLockedSubmitButton, setEnteredInputIsInvalid)

        if(lockedSubmitButton && checkInputUser){
            console.log({test: 'it came through!'})
            console.log({invalidInputPaymentButton: enteredInputIsInvalid})

            setEnteredInputIsInvalid(inputValidList)
            // return
        }

        Object.keys(paymentMethodOptions.fields).forEach(key => {
            const value = paymentMethodOptions.fields[key]
            if(value.id == identifier){
                // updateEnteredInputState('paymentMethod',value.name)
                updateEnteredInputState('paymentMethodName', value.name)
                updateEnteredInputState('paymentMethodId', identifier)
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
                onClick: (e) => inputHandlePaymentMethod('ideal', e), 
            },
            {
                name: 'CreditCard', 
                id: 'credit_card', 
                type: 'text', 
                value: paymentType.credit_card, 
                onClick: (e) => inputHandlePaymentMethod('credit_card', e), 
            },
            {
                name: 'PayPal', 
                id: 'pay_pal', 
                type: 'text', 
                value: paymentType.pay_pal, 
                onClick: (e) => inputHandlePaymentMethod('pay_pal', e), 
            }
        ]
    }
    
    const ApiRequest = useCallback(
        async () => {
            const response = data
            
            if(!response.lines){
                console.log({ apiResponseError : response})
                throw {error: 'Not Found!'}
            }

            updateUserData('userInfo', {...response.user})
            updateUserData('userAddress', {...response.address})
            updateUserData('userOrder', 
                {
                    // orderId: response.orderId,
                    currency: response.currency,
                    lastOrder: response.lines,
                    orderTaxPrice: response.orderTaxPrice,
                    orderTotalAmount: response.amount.value,
                    orderTotalProductPrice: response.orderTotalProductPrice,
                })

            setLocalStorageItem('amount',response.amount)
            setLocalStorageItem('locale',response.locale)
            setLocalStorageItem('description',response.description)
            setLocalStorageItem('orderNumber',response.orderId)
            // setLocalStorageItem('consumerDateOfBirth',response.user.consumerDateOfBirth)
            setLocalStorageItem(response.curreny.name,response.curreny.symbol)                  
            setLocalStorageItem('lines', response.lines)                   
    })

    const userAddressModalHandler = useCallback(
        (event) =>  { 
            dialogUserAddress.current.open()
        }
    )

    const paymentMethodModalHandler = useCallback(
        (event) => {
            dialogUserPaymentMethod.current.open()
        }
    )

    const payOrderHandler = async (event) => {
        event.preventDefault()
        
        const checkInputUser = findAndUpdateInvalidList(enteredInput, setLockedSubmitButton, setEnteredInputIsInvalid)

        if(checkInputUser){
            console.log({test: 'it came through!'})
            console.log({invalidInputPaymentButton: enteredInputIsInvalid})

            // setInputInvalidTrueWhenEnteredInputEmpty(enteredInput, setEnteredInputIsInvalid)
            return
        }
        // setEnteredInputIsInvalid(inputValidList)

        const mollieOrder = JSON.parse(localStorage.getItem(addressStorageName))
        const lines = JSON.parse(localStorage.getItem('lines'))

        const amount = JSON.parse(localStorage.getItem('amount'))
        const orderNumber = JSON.parse(localStorage.getItem('orderNumber'))
        const locale = JSON.parse(localStorage.getItem('locale'))
        const description = JSON.parse(localStorage.getItem('description'))
        let splitFullName = mollieOrder.firstAndLastName
        const userNameArray = splitFullName.split(" ")
        const streetAndNumber = mollieOrder.addressLine + ' ' + mollieOrder.streetNumber
        const addintionalNumber = mollieOrder.unitNumber
        const subscription = lines.find((line) => line.productDetails.subscriptionDetails.productSubscription === "month")
        const { productDetails } = subscription
        const { subscriptionDetails } = productDetails

        const billingAddress = {
            title: 'Mr.', // set gender check
            givenName : userNameArray[0],
            familyName : userNameArray[1],
            organisationName: '', // set gender check
            streetAndNumber : streetAndNumber.trim(),
            streetAdditional : addintionalNumber,
            postalCode : mollieOrder.postalCode,
            email : mollieOrder.email,
            phone : mollieOrder.phoneNumber,
            city : mollieOrder.city,
            region : mollieOrder.state,
            country : mollieOrder.country,
        }

        const confirmUserOrder = {
            description: description,
            amount: amount,
            order_id: orderNumber.toString(),
            redirectUrl: 'http://localhost:5173/payment',
            webhookUrl: 'https://aafc-95-96-151-55.ngrok-free.app',
            billingAddress: billingAddress,
            shippingAddress: billingAddress,
            metadata: { order_id : orderNumber.toString()},
            locale: locale,
            method: mollieOrder.paymentMethodId,
            lines: lines.map((line) => {
                delete line.productDetails
                return line
            }) ,
            subscriptionDetail: subscriptionDetails,
            sequenceType: ''
        }

        console.log({subscriptionDetails: subscriptionDetails})

        const paymentOption = { url: '/api/v1/payment', method: 'POST'}
        const ApiPayOptions = ApiFetchPostOptions(paymentOption, confirmUserOrder, {'X-Authorization': 'Bearer ' + token})

        try {
            const payResponse = await ApiFetch(ApiPayOptions)
            const getPayResults = await payResponse.json()
        
            if(!payResponse.ok)
            { //if(response.status >= 400 && response.status <= 600)
                // const errorJson = await response.json()
                throw {message: 'Api error send order address error!', errors: getPayResults}
            }

            console.log('Succes Pay Order!')

        const redirectIDeal = getPayResults.redirect
        window.location.replace(redirectIDeal) // external website

        } catch (error) {
            
            console.log({API_payOrder:error})

        }
    }

    const userAddressHandler = async (event) => {
        event.preventDefault()

        if(lockedSubmitButton || findInvalidInput(enteredInputIsInvalid))
            {
                const { firstAndLastName, email, phoneNumber, ...deconstructInvalidList} = inputValidList 
                setEnteredInputIsInvalid(deconstructInvalidList)
                setLockedSubmitButton(false)
            }

        let userAddressInfo = prepareInputForRequest(enteredInput, setEnteredInputIsInvalid, enteredInput.cityId, ctxValue.availableCities, enteredInput.stateId, ctxValue.availableStates)
        
        userAddressInfo = { ...userAddressInfo, ['location']: enteredInput.city}
        userAddressInfo = { ...userAddressInfo, ['region']: enteredInput.state}
        userAddressInfo = { ...userAddressInfo, ['reactStateNr']: ctxValue.currentUserState.toString()}
        userAddressInfo = { ...userAddressInfo, ['reactCityNr']: ctxValue.currentUserCity.toString()}
        console.log({formAddress: userAddressInfo})
        
        const options = { url: '/api/v1/order/address', method: 'POST'}
        const ApiUserAddressOptions = ApiFetchPostOptions(options, userAddressInfo, {'X-Authorization': 'Bearer ' + token})            
        
        try {
            const response = await ApiFetch(ApiUserAddressOptions)
            const getResults = await response.json()
            
            if(!response.ok)
                { //if(response.status >= 400 && response.status <= 600)
                // const errorJson = await response.json()
                throw {message: 'Api error send order address error!', errors: getResults.errors}
                
            }

            // close modal

        } catch (error) {
            
            // console.log({API_updateUserOrder:error})
            if(Array.isArray(error.errors) && (error.errors.length > 1))
            {
                let collectErrors = [];

                error.errors.map((error) => {
                    collectErrors[error.property] = error.message
                })

                updateErrors('userAddress', collectErrors)

            } else if(Array.isArray(error.errors) && (error.errors.length == 1) ){

                let arrayProperties = error.errors[0].property

                if (Array.isArray(arrayProperties)) arrayProperties = arrayProperties[0]

                const messageError = error.errors[0].message
                
                setErrors(() => {
                    return {
                        ['userAddress']: {[arrayProperties]: messageError}
                    }
                })
                    
            } else {
                
                if(error.errors?.property instanceof Array){
                    let arrayProperties = error.errors.property

                   if (Array.isArray(arrayProperties)) arrayProperties = arrayProperties[0]

                    const messageError = error.errors.message

                    console.log({retrievedErrorProperty: arrayProperties, messageError})
                    
                    setErrors(() => {
                        return {
                            ['userAddress']: {[arrayProperties]: messageError}
                        }
                    })
                }

                console.log({unHandledError: error})
            }

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

        console.log({ lockedSubmitButton, errorsLength: errors.userAddress.length, errors: errors.userAddress})
        if(lockedSubmitButton || Object.keys(errors.userAddress).length !== 0)
            {
                setErrors({userAddress: {}})
                setLockedSubmitButton(false)
            }

        if(identifier == 'state')
            {
                const state = stateList.find((state) => state.id == Number(event.target.value)); //here you will get full state object.
                updateEnteredInputState('state_id', state.id)       
                updateEnteredInputState(identifier, state.name)
                GetCity(countryid, state.id).then((result) => {
                    setCityList(result)
                })
                setInvalidTypeStatus(identifier, false)
                return
            }
            
        if(identifier == 'city')
            {
                const city = cityList.find((city) => city.id == Number(event.target.value))
                updateEnteredInputState('city_id', city.id)
                updateEnteredInputState(identifier, city.name)
                checkLocationStatus('location')
                
                setInvalidTypeStatus(identifier, false)
                setInvalidTypeStatus('city_id', false)
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

    function setInvalidTypeStatus(identifier, value)
    {
        setEnteredInputIsInvalid((prevValues) => ({
            ...prevValues,
            [identifier]: value
        }))
    }

    function inputBlurHandle(identifier, event, type) {

        console.log({test: identifier, value: event.target.value, type: type})
        if(identifier == 'unitNumber'){
            return
        }
        
        if(type === 'text')
            {
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : regexSearchText.test(event.target.value) ? false : true
                }))
                return
            }  

        if(type === 'number')
            {
                console.log({regex: event.target.value})
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : regexSearchInt.test(event.target.value) ? false : true
                }))
                return
            }  
            
        if(type === 'location')
            {
            console.log({locationEvent:event})
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : (event.target.value == '') ? true : false
            })) 
        }

        if(type === 'mixed'){
            console.log({inputBlurPostalCode: event.target.value})
        }

        setEnteredInputIsInvalid((prevValues) => ({
            ...prevValues,
            [identifier] : (!event.target.value) ? true : false
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

    console.log({errors})
    console.log({enteredInputIsInvalid})
    console.log({enteredInput})
    // console.log({userData_lastOrder: userData.userOrder})
    return (
        <>
            <OrderContext.Provider value={ctxValue}>
                <UserDataModal 
                    ref={dialogUserAddress} 
                    enteredInput={enteredInput} 
                    formSubmit={userAddressHandler} 
                    user={userData.userInfo} 
                    address={userData?.userAddress}
                    addressStorageName={addressStorageName}
                    enteredInputIsInvalid={enteredInputIsInvalid}
                    errors={errors.userAddress}
                />

                <UserChoosePaymentModal ref={dialogUserPaymentMethod} paymentMethodOptions={paymentMethodOptions} />

                <section className="flex-col shadow-md w-full bg-slate-100 py-5 rounded-md px-3 sm:mx-2 sm:px-5 md:grid md:mx-2 md:shadow-xl">

                    <h1 className={`pt-3 pb-6 mt-12 text-2xl text-center`}>Address & Peronsal Information</h1>
                    {userData?.userInfo && userData?.userAddress && 
                    <UserOrderInfoForm 
                        // errorClass={`${lockedSubmitButton || (Object.keys(errors.userAddress).length > 0) && 'border-red-300'}`}
                        errorClass={`${findInvalidInput(enteredInputIsInvalid) && 'border-red-300'}`}
                        userAddressModalHandler={userAddressModalHandler} 
                        user={userData.userInfo} 
                        address={userData.userAddress} 
                    />}

                    <h1 className={`pt-3 pb-6 mt-8 text-2xl text-center`}>Choose Payment Method</h1>
                    <UserSelectPaymentMethodForm 
                        // errorClass={`${lockedSubmitButton || !enteredInput.paymentMethodId && 'border-red-300'}`}
                        errorClass={`${!enteredInput.paymentMethodId && 'border-red-300'}`}
                        symbol={enteredInput.paymentMethodId} 
                        paymentMethodModalHandler={paymentMethodModalHandler}  
                        selectedType={enteredInput.paymentMethodName}
                    />

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
                                    <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">{paymentCurrency} {userData?.userOrder?.orderTotalProductPrice}</section>
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
                                    <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">{paymentCurrency} {userData?.userOrder?.orderTaxPrice}</section>
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
                                    <section className="font-bold text-blue-600/80 sm:text-lg md:text-xl">{paymentCurrency} {userData?.userOrder.orderTotalAmount}</section>
                                </Box>
                            </Grid>
                        </Box>
                        <Form 
                            onSubmit={(e) => payOrderHandler(e)}
                            className='flex mt-16 mb-20 justify-center'
                        >
                            <input type="hidden" id="paymentMethod" value={enteredInput.paymentMethodName}/>
                            {/* lockedSubmitButton */}
                            <button
                                disabled={lockedSubmitButton}
                                className={`text-slate-100 h-16 px-8 w-full rounded-b-full text-2xl rounded-t-full border-0 ring-2 shadow-xl ${ !lockedSubmitButton ? 'ring-red-500 bg-red-500 bg-gradient-to-r from-red-500 to-yellow-500' : 'bg-gray-300'} md:w-1/2  
                                   ${!lockedSubmitButton && 'transition-all duration-300 hover:from-orange-400 hover:text-yellow-200 hover:to-red-400 hover:ring-red-400 hover:shadow-2xl'} `}
                            >
                                {/* Order and Pay amount {enteredInput?.paymentMethodName ? 'with ' + enteredInput.paymentMethodName : ''} {paymentCurrency} {userData?.userOrder.lastOrder[1]?.productDetails.subscriptionDetails.subscriptionAmount} {userData?.userOrder.orderTotalAmount} */}
                                Order and Pay amount {enteredInput?.paymentMethodName ? 'with ' + enteredInput.paymentMethodName : ''} {paymentCurrency} {userData?.userOrder.orderTotalAmount}
                            </button>
                        </Form>
                    </section>
                    
                </section>
            </OrderContext.Provider>
        </>
    )
}

export default PaymentPage