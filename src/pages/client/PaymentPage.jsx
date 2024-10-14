import { useState, useEffect, useCallback, useRef, createRef } from 'react'
import { 
    ApiFetchPostOptions,
    ApiFetch,
    prepareInputForRequest,
    findAndUpdateInvalidList,
    findInvalidInput,
    findInvalidOrErrorInput
} from "../../js/util/postUtil.js"

import {
    getLocalStorageItem, 
    setLocalStorageItem, 
    setStorageUserSelectedSubscription,
    getUserInfoObjOrStorageData,
} from "../../js/util/getUtil.js"

import { countryid, inputPaymentValidList } from '../../js/util/auth.js'
import inMemoryJwt from '../../js/util/inMemoryJwt.js'

import { useLoaderData, Form, useNavigate } from 'react-router-dom'

import UserDataModal from '../../components/modal/UserDataModal'
import UserChoosePaymentModal from '../../components/modal/UserChoosePaymentModal'
import UserOrderInfoForm from "../../components/forms/client/UserOrderInfoForm"
import SelectedOrderForPaymentInterface from '../../components/interface/SelectedOrderForPaymentInterface'
import PaymentLineSection from '../../components/section/PaymentLineSection'

// import PaymentErrorBoundary from '../../components/class/errorHandler/PaymentErrorBoundary.jsx'

import { validateAndSetStatus } from '../../components/ui/input/ValidateIBAN.jsx'

import { GetState, GetCity } from "react-country-state-city"
import UserSelectPaymentMethodForm from '../../components/forms/client/UserSelectPaymentMethodForm'

import { OrderContext } from '../../store/shop-order-context'

const PaymentPage = () => {

    const typeFirstAndLastName = 'firstAndLastName'
    const addressStorageName = 'user_address'
    const data = useLoaderData()
    const navigate = useNavigate()
    const regexSearchText = /^[A-Za-z]+$/
    // const regexSearchFirstAndLastName = /^[a-zA-Z]+\s[a-zA-Z]+$/
    const regexSearchInt = /^\d+$/
    
    const [paymentType, setPaymentType] = useState({
        ideal : false,
        credit_card : false,
        pay_pal : false,
    })    

    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState(inputPaymentValidList)

    const [stateList, setStateList] = useState([]) 
    const [cityList, setCityList] = useState([])
    
    const userFormInfo = getUserInfoObjOrStorageData(addressStorageName)
    const [enteredInput, setEnteredInput] = useState(userFormInfo)
    const dialogUserAddress = useRef()
    const dialogUserPaymentMethod = useRef()

    const refPaymentSection = useRef([])
    refPaymentSection.current = [...Array(refPaymentSection.current.length).keys()].map((index) => refPaymentSection.current[index] ?? createRef())
    const pushRef = (index) => refPaymentSection.current.push(index)

    const token = inMemoryJwt.getToken()
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
    const {paymentMethodId, iban, ...enteredAddress} = enteredInputIsInvalid

    function updateUserData(identifier, value){
        setUserData((prevState) => ({
            ...prevState,
            [identifier]: value
            }
        )
    )}
    
    function updateErrors(identifier, value){
        setErrors((prevState) => ({
            ...prevState,
            [identifier]: value
            }
        )
    )}

    const getState = useCallback(
        () => GetState(countryid).then((result) => {
            setStateList(result)
        })  
    , [countryid])
    
    const getCity = useCallback(
        () => GetCity(countryid, Number(userData.userAddress.reactStateNr)).then((result) => {
            setCityList(result)
        }) 
    ,[countryid, userData.userAddress.reactStateNr])

    function updateEnteredInputState(identifier, value){
        setEnteredInput((prevValues) => {
            return {
                ...prevValues,
                [identifier]: value
            }
        })
    }

    useEffect(() => {
        ApiData()
        getState()
        getCity()

        setEnteredInput((prevValue) => ({
            ...prevValue,
            ['city_id']: Number(userData.userAddress.reactCityNr)
        }))
        
        setEnteredInput((prevValue) => ({
            ...prevValue,
            ['state_id']: Number(userData.userAddress.reactStateNr)
        }))
        
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
        
        if(data.address){
            const { id, firstAndLastName, email, unitNumber, reactStateNr, reactCityNr, ...deconstructLoadedUserData} = data.address 
            
            for (const [key, value] of Object.entries(deconstructLoadedUserData)) {
                
                if(key === 'addressLine'){                    
                    value === "" && setInvalidTypeStatus(key, true)
                    continue
                }

                if(key === 'streetNumber'){            
                    // console.log({strNmber: key, value})        
                    !regexSearchInt.test(value) && setInvalidTypeStatus(key, true)
                    continue
                }

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

    const scrollSmoothHandler = (invalidKey) => {
        console.log({invalidKeyPayment: invalidKey})
        let targetSection = 0
        if(invalidKey === 'paymentMethodId') targetSection = 1 // console.log({testRefIfInvalid: invalidKey, targetSection: targetSection, refPaymentSection: refPaymentSection.current})
        if(invalidKey === 'iban') targetSection = 1 // console.log({testRefIfInvalid: invalidKey, targetSection: targetSection, refPaymentSection: refPaymentSection.current})
        refPaymentSection.current[targetSection].scrollIntoView({ behavior: "smooth", block: "start"})
    }
    
    function checkLocationStatus(id){
        setEnteredInputIsInvalid((prevValues) => ({
            ...prevValues,
            [id] : false})
        )
    }
    
    const inputHandlePaymentMethod = (identifier, event) => {
        event.preventDefault() 

        const checkInvalidInput = findAndUpdateInvalidList(enteredInput, setEnteredInputIsInvalid)

        if(checkInvalidInput.bool) setEnteredInputIsInvalid(inputPaymentValidList)

        Object.keys(paymentMethodOptions.fields).forEach(key => {
            const value = paymentMethodOptions.fields[key]
            if(value.id === identifier){
                updateEnteredInputState('paymentMethodName', value.name)
                updateEnteredInputState('paymentMethodId', identifier)
            }
        })

        if(!enteredInput.iban && getLocalStorageItem('selected_subscription_0') !== null){
            setEnteredInput((prevValues) => ({
                ...prevValues,
                iban: ''
            }))
        }

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
    
    const ApiData = useCallback(
        async () => {
            const response = data
            
            if(!response.lines){
                console.log({ apiResponseError : response})
                throw {error: 'Not Found!'}
            }

            const jsonToObj = response.lines

            setStorageUserSelectedSubscription(jsonToObj)

            updateUserData('userInfo', {...response.user})
            updateUserData('userAddress', {...response.address})
            updateUserData('userOrder', 
                {
                    // orderId: response.orderId,
                    currency: response.currency,
                    lines: response.lines,
                    orderTaxPrice: response.orderTaxPrice,
                    orderTotalAmount: response.amount.value,
                    orderTotalProductPrice: response.orderTotalProductPrice,
                })

            setLocalStorageItem('amount',response.amount)
            setLocalStorageItem('locale',response.locale)
            setLocalStorageItem('description',response.description)
            setLocalStorageItem('order_number',response.orderId)
            setLocalStorageItem(response.curreny.name,response.curreny.symbol)                  
            setLocalStorageItem('lines', response.lines)                   
    }, [data])

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
        
        const mollieOrder = JSON.parse(localStorage.getItem(addressStorageName))
        // const checkInvalidInput = findInvalidOrErrorInput(enteredInputIsInvalid, errors.userAddress)         
        const checkInvalidInput = findAndUpdateInvalidList(mollieOrder, setEnteredInputIsInvalid)         
        console.log({whatEntered: checkInvalidInput, enteredInput})

        if(checkInvalidInput.bool){
            console.log({whyNot: checkInvalidInput})
            scrollSmoothHandler(checkInvalidInput.invalidKey)
            return
        }

        const lines = JSON.parse(localStorage.getItem('lines'))
        const amount = JSON.parse(localStorage.getItem('amount'))
        const orderNumber = JSON.parse(localStorage.getItem('order_number'))
        const locale = JSON.parse(localStorage.getItem('locale'))
        const description = JSON.parse(localStorage.getItem('description'))
        let splitFullName = mollieOrder.firstAndLastName
        const userNameArray = splitFullName.split(" ")
        const streetAndNumber = mollieOrder.addressLine + ' ' + mollieOrder.streetNumber
        const addintionalNumber = mollieOrder.unitNumber
        const subscription = lines.find((line) => line.productDetails.subscriptionDetails.subscriptionTimeUnit === "month")
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
            redirectUrl: 'http://localhost:5173/dashboard', // set user dashbpoard {id}
            webhookUrl: 'https://15e2-95-96-151-55.ngrok-free.app',
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
            sequenceType: '',
            iban: mollieOrder.iban
        }

        const paymentOption = { url: '/api/v1/payment', method: 'POST'}
        const ApiPayOptions = ApiFetchPostOptions(paymentOption, confirmUserOrder, {'X-Authorization': token})

        try {
            const payResponse = await ApiFetch(ApiPayOptions)
            const getPayResults = await payResponse.json()
        
            if(!payResponse.ok)
            {   //if(response.status >= 400 && response.status <= 600)
                // const errorJson = await response.json()
                throw {message: 'Api error send order address error!', errors: getPayResults}
            }

            const redirectIDeal = getPayResults.redirect
            window.location.replace(redirectIDeal) // external website

        } catch (error) {
            
            console.log({API_payOrder:error})

        }
    }

    const userAddressHandler = async (event) => {
        event.preventDefault()

        if(findInvalidInput(enteredAddress))
            {
                const { firstAndLastName, email, phoneNumber, ...deconstructInvalidList} = inputPaymentValidList 
                setEnteredInputIsInvalid(deconstructInvalidList)
            }

        let userAddressInfo = prepareInputForRequest(enteredInput, setEnteredInputIsInvalid, enteredInput.cityId, ctxValue.availableCities, enteredInput.stateId, ctxValue.availableStates)
        
        userAddressInfo = { ...userAddressInfo, ['location']: enteredInput.city}
        userAddressInfo = { ...userAddressInfo, ['region']: enteredInput.state}
        userAddressInfo = { ...userAddressInfo, ['reactStateNr']: ctxValue.currentUserState.toString()}
        userAddressInfo = { ...userAddressInfo, ['reactCityNr']: ctxValue.currentUserCity.toString()}
        
        const options = { url: '/api/v1/order/address', method: 'POST'}
        const ApiUserAddressOptions = ApiFetchPostOptions(options, userAddressInfo, {'X-Authorization': token})            
        
        try {
            const response = await ApiFetch(ApiUserAddressOptions)
            const getResults = await response.json()
            
            if(!response.ok)
            {   //if(response.status >= 400 && response.status <= 600)
                // const errorJson = await response.json()
                throw {message: 'Api error send order address error!', errors: getResults.errors}                
            }

        } catch (error) {
            
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
                
                updateErrors('userAddress', {[arrayProperties]: messageError})

            } else {
                
                if(error.errors?.property instanceof Array){
                    let arrayProperties = error.errors.property
                    
                    if (Array.isArray(arrayProperties)) arrayProperties = arrayProperties[0]
                    
                    const messageError = error.errors.message
                    
                    updateErrors('userAddress', {[arrayProperties]: messageError})
                }

                console.log({unHandledError: error})
            }
        }
    }    

    const handleUserSelectLocation = (identifier, event) => {

        console.log({ errorsLength: errors.userAddress.length, errors: errors.userAddress})
        if(Object.keys(errors.userAddress).length !== 0)
            {
                setErrors({userAddress: {}})
            }

        if(identifier === 'state')
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
            
        if(identifier === 'city')
            {
                const city = cityList.find((city) => city.id == Number(event.target.value))
                updateEnteredInputState('city_id', city.id)
                updateEnteredInputState(identifier, city.name)
                checkLocationStatus('location')
                
                setInvalidTypeStatus(identifier, false)
                setInvalidTypeStatus('city_id', false)
                return
            }
    
        if(identifier === 'streetNumber')
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
        
        if(identifier === 'phoneNumber')
            {
                console.log({phoneNumber:event})
                updateEnteredInputState(identifier, event)
                return
            }    
        
        if(identifier !== undefined && event !== '')
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

        if(identifier === 'unitNumber') return
        
        if(type === 'text')
            {
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : regexSearchText.test(event.target.value) ? false : true
                }))
                return
            }  
            
        if(type === typeFirstAndLastName)
            {
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    // [identifier] : regexSearchFirstAndLastName.test(event.target.value) ? false : true
                    [identifier] : event.target.value !== "" ? false : true
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
        updateUserInput: handleUserSelectLocation,
        onBlur: inputBlurHandle,
    }

    const handleKeyDown = (identifier,event) => {
        if(event.key !== "Backspace") return
        const eniProperty = enteredInput[identifier]
        const backspaceInput = eniProperty.substring(0, eniProperty.length - 1)
        // console.log({keyPressed: event.key, identifier, eniProperty, checkLength: eniProperty.length, backspaceInput})
        if(eniProperty.length > 0) updateUserData( identifier, backspaceInput)
    }

    console.log({enteredInputIsInvalid, enteredInput})
    return (
        <>     
            <OrderContext.Provider value={ctxValue}>
                    <UserDataModal 
                        ref={dialogUserAddress} 
                        enteredInput={enteredInput} 
                        formSubmit={userAddressHandler} 
                        handleKeyDown={handleKeyDown}
                        enteredInputIsInvalid={enteredInputIsInvalid}
                        errors={errors.userAddress}
                    />

                    <UserChoosePaymentModal ref={dialogUserPaymentMethod} paymentMethodOptions={paymentMethodOptions} />

                    <section className="flex-col shadow-md w-full bg-slate-100 py-5 rounded-md px-3 sm:mx-2 sm:px-5 md:grid md:mx-2 md:shadow-xl">

                        <h1 ref={pushRef}className={`pt-3 pb-6 mt-12 text-2xl text-center`} >Address & Peronsal Information</h1>
                        {userData?.userInfo && userData?.userAddress && 
                        <UserOrderInfoForm 
                            errorClass={`${findInvalidOrErrorInput(enteredAddress, errors.userAddress) && 'border-red-300'}`}
                            userAddressModalHandler={userAddressModalHandler} 
                            enteredInput={enteredInput}
                            user={userData.userInfo} 
                            address={userData.userAddress} 
                        />}

                        <h1 ref={pushRef} className={`pt-3 pb-6 mt-8 text-2xl text-center`} >Choose Payment Method</h1>
                        <UserSelectPaymentMethodForm
                            errorClass={`${!enteredInput.paymentMethodId && 'border-red-300'}`}
                            symbol={enteredInput.paymentMethodId}
                            paymentMethodModalHandler={paymentMethodModalHandler}
                            selectedType={enteredInput.paymentMethodName}
                        />

                        {enteredInput.paymentMethodId && <section className='grid flex-col md:justify-items-center'>
                            <section className={`border-4 rounded-lg py-4 mt-4 sm:w-full md:w-3/5 hover:bg-slate-200 ${enteredInputIsInvalid.iban ? 'border-red-300' : 'border-slate-300' }`}>
                                <h2 ref={pushRef} className={`text-center ${enteredInputIsInvalid.iban && 'text-rose-600'}`}>please enter your IBAN/ bank account number </h2><br />
                                <span className='flex justify-center'>
                                    <label>
                                        <input id='iban' type="text" onChange={(e) => ctxValue.updateUserInput('iban',e)} onBlur={(e) => validateAndSetStatus( e, setInvalidTypeStatus)} />
                                    </label>
                                </span>
                            </section>
                        </section>}

                        <h1 className={`pt-3 pb-6 mt-8 text-2xl text-center`}>Order</h1>
                        { userData?.userOrder.lines != undefined && <SelectedOrderForPaymentInterface latestOrder={userData?.userOrder.lines}/> }
                        
                        <PaymentLineSection paymentCurrency={paymentCurrency} userData={userData}/>
                        
                        <Form onSubmit={(e) => payOrderHandler(e)} className='flex mt-16 mb-20 justify-center' >
                            <input type="hidden" id="paymentMethod" value={enteredInput.paymentMethodName}/>
                            <button
                                className={`ring-red-500 bg-rose-500 transition-all duration-300 text-slate-100 h-16 px-8 w-full rounded-b-full 
                                rounded-t-full text-2xl border-0 ring-2 shadow-xl md:w-1/2 hover:text-yellow-200 hover:bg-rose-900/75 hover:shadow-2xl`}
                            >
                                {
                                    !findInvalidOrErrorInput(enteredInputIsInvalid, errors.userAddress) 
                                    ? 'Pay with ' + enteredInput.paymentMethodName + ' ' + paymentCurrency + ' ' + userData?.userOrder.orderTotalAmount 
                                    : 'cannot proceed payment with invalid fields '
                                }
                            </button>
                        </Form>

                    </section>
            </OrderContext.Provider>
        </>
    )
}

export default PaymentPage