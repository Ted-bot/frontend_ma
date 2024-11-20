import { useState, useEffect, useCallback, useRef, createRef } from 'react'
import { HttpError, useAuthenticated } from 'react-admin'
import { Form } from 'react-router-dom'
import { useErrorBoundary } from "react-error-boundary"
import {  GetState, GetCity } from "react-country-state-city"

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


import UserSelectPaymentMethodForm from '../../components/forms/client/UserSelectPaymentMethodForm'
import {UserDataModal} from '../../components/modal/UserDataModal'
import UserChoosePaymentModal from '../../components/modal/UserChoosePaymentModal'
import UserOrderInfoForm from "../../components/forms/client/UserOrderInfoForm"
import SelectedOrderForPaymentInterface from '../../components/interface/SelectedOrderForPaymentInterface'
import PaymentLineSection from '../../components/section/PaymentLineSection'
import { validateAndSetStatus } from '../../components/ui/input/ValidateIBAN.jsx'
import { handleKeyDown } from '../../js/keyBoardUtil.js'
import { paymentInputBlurHandle } from '../../components/class/userData/PaymentFormHelper.jsx'
import useStore from '../../hooks/store/useStore.jsx'
import MainNavigation from '../../components/navigations/MainNavigation.jsx'
import { OrderContext } from '../../store/shop-order-context.js'
import { errorHandlerPaymentUserAddressRequest } from '../../components/class/userData/FormHelper.jsx'

import { useUserAddressData } from '../../hooks/query/usePaymentQuery.jsx'

export const PaymentPage = () => {
    useAuthenticated()
    const {userAddressData, status} = useUserAddressData()
    const {showBoundary} = useErrorBoundary()
    const addressStorageName = 'user_address'
    const [error, setError] = useStore('error')
    const [message, setMessage] = useStore('message')
    
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
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogOpenPaymentMethod, setDialogOpenPaymentMethod] = useState(false)
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
        paymentIssue: {}
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
    
    function updateUserAddressErrors(identifier, value){
        setErrors((prevState) => ({
                ...prevState,
                userAddress: {
                    ...prevState.userAddress,
                    [identifier]: value
                }
            }
        )
    )}

    const getState = useCallback(
        () => GetState(countryid).then((result) => {
            setStateList(result)
        })  
    , [countryid])
    
    const getCity = useCallback(
        () => GetCity(countryid, Number(enteredInput?.city_id)).then((result) => {
            console.log("Payment page cityList", result)
            setCityList(result)
        }) 
    ,[countryid, enteredInput?.city_id])
    console.log("got CityID", userData?.userAddress)
    function updateEnteredInputState(identifier, value){
        setEnteredInput((prevValues) => {
            return {
                ...prevValues,
                [identifier]: value
            }
        })
    }

    useEffect(() => {
        if(userAddressData?.user){
            Object.entries(userAddressData?.user).map(([k,v]) => updateEnteredInputState(k, v))
            updateEnteredInputState('country', 'NL')
            ApiDataToStorage(userAddressData) // response

            if(userAddressData?.address){
                if(userAddressData?.address.length != 0){ // check if not a empty array
                    Object.entries(userAddressData?.address).map(([k,v]) => updateEnteredInputState(k, v))
                }
            }
            
            getState()
            getCity()
        }

        //     const { id, firstAndLastName, email, unitNumber, state_id, ciiy_id, ...deconstructLoadedUserData} = response?.address 
            
        //     for (const [key, value] of Object.entries(deconstructLoadedUserData)) {
                
        //         if(key === 'addressLine'){                    
        //             value === "" && setInvalidTypeStatus(key, true)
        //             continue
        //         }

        //         if(key === 'streetNumber'){            
        //             // console.log({strNmber: key, value})        
        //             !regexSearchInt.test(value) && setInvalidTypeStatus(key, true)
        //             continue
        //         }

        //         if(!value){
        //             setInvalidTypeStatus(key, true)
        //         }
        //     }
        // }
        
    }, [userAddressData?.user?.email])

    console.log("userAddressData", userAddressData)

    useEffect(() => {
        setLocalStorageItem(addressStorageName,enteredInput)
    }
    ,[enteredInput])

    useEffect(() => {
        setLocalStorageItem(addressStorageName,userData.userAddress)
    }
    ,[userData])

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
    
    const ApiDataToStorage = useCallback(
         (response) => {
            console.log("got data", response)
            if(!response?.lines){
                console.log({ apiResponseError : response})
                // throw {error: 'Not Found!'}
            }

            const jsonToObj = response?.lines

            setStorageUserSelectedSubscription(jsonToObj)

            // useffect will load remain data
            updateUserData('userInfo', {...response?.user})
            console.log("userData Address", response?.address)
            updateUserData('userAddress', {...response?.address}) //organizationName' : 'none' ,
            updateUserData('userOrder', 
                {
                    currency: response?.currency,
                    lines: response?.lines,
                    orderTaxPrice: response?.orderTaxPrice,
                    orderTotalAmount: response?.amount.value,
                    orderTotalProductPrice: response?.orderTotalProductPrice,
                })


            setLocalStorageItem('amount',response?.amount)
            setLocalStorageItem('locale',response?.locale)
            setLocalStorageItem('description',response?.description)
            setLocalStorageItem('order_number',response?.orderId)
            setLocalStorageItem(response?.curreny.name,response?.curreny.symbol)                  
            setLocalStorageItem('lines', response?.lines)                   
    }, [])
    

    const userAddressModalHandler = () =>  { 
            setDialogOpen(true)
        }

    const closeUserAddressModalHandler = () =>  { 
            console.log({ButtonHit: 'close'})
            setDialogOpen(false)
        }

    const userPaymentMethodModalHandler = () =>  { 
        setDialogOpenPaymentMethod(true)
    }

    const closeUserPaymentMethodModalHandler = () =>  { 
        console.log({ButtonHit: 'close'})
        setDialogOpenPaymentMethod(false)
    }

    const payOrderHandler = async (event) => {
        event.preventDefault()
        // console.log("EnteredInputPayment", event)

        userAddressHandler(event)
        // return

        const mollieOrder = JSON.parse(localStorage.getItem(addressStorageName))       
        const checkInvalidInput = findAndUpdateInvalidList(mollieOrder, setEnteredInputIsInvalid)         
        console.log({whatEntered: checkInvalidInput, enteredInput})
        console.log({mollieOrder: mollieOrder})

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
        let splitFullName = enteredInput.firstAndLastName
        const userNameArray = splitFullName.split(" ")
        const streetAndNumber = enteredInput.addressLine + ' ' + enteredInput.streetNumber
        const addintionalNumber = enteredInput.unitNumber
        const subscription = lines.find((line) => line.productDetails.subscriptionDetails.subscriptionTimeUnit === "month")
        const { productDetails } = subscription
        const { subscriptionDetails } = productDetails

        const billingAddress = {
            title: 'Mr.', // set gender check
            givenName : userNameArray[0],
            familyName : userNameArray[1],
            organizationName: '', // set gender check
            streetAndNumber : streetAndNumber.trim(),
            streetAdditional : addintionalNumber,
            postalCode : enteredInput.postalCode,
            email : enteredInput.email,
            phone : enteredInput.phoneNumber,
            city : enteredInput.city,
            region : enteredInput.state ?? null,
            country : enteredInput.country,
        }

        const confirmUserOrder = {
            description: description,
            amount: amount,
            order_id: orderNumber.toString(),
            redirectUrl: 'http://localhost:5173/dashboard', // set user dashbpoard {id}
            webhookUrl: 'https://3abe-95-96-151-55.ngrok-free.app',
            billingAddress: billingAddress,
            shippingAddress: billingAddress,
            metadata: { order_id : orderNumber.toString()},
            locale: locale,
            method: enteredInput.paymentMethodId,
            lines: lines.map((line) => {
                delete line.productDetails
                return line
            }) ,
            subscriptionDetail: subscriptionDetails,
            sequenceType: '',
            iban: enteredInput.iban ?? null
        }

        const paymentOption = { url: '/api/v1/payment', method: 'POST'}
        const ApiPayOptions = ApiFetchPostOptions(paymentOption, confirmUserOrder, {'X-Authorization': token})

        try {
            const payResponse = await ApiFetch(ApiPayOptions)
            const getPayResults = await payResponse?.json()
        
            if(!payResponse?.ok)
            {   //if(response?.status >= 400 && response?.status <= 600)
                throw {message: 'Api error send order address error!', errors: getPayResults}
            }

            const redirectIDeal = getPayResults.redirect
            window.location.replace(redirectIDeal) // external website

        } catch (error) {
            console.log({API_payOrder:error})
            for (const [key, value] of Object.entries(error.errors.errors)){

                if(key === "errors") return

                let keyError = String(key)
                if(keyError.includes(".")){
                    const splitKey = keyError.split(".")
                    keyError = splitKey[1]
                    console.log("got Property Error Key", keyError)
                }

                if(keyError.includes("givenName") || keyError.includes("familyName")){
                    keyError = "firstAndLastName"
                }
                
                if(keyError.includes("city")) {
                    keyError = "reactCityNr"
                }
                
                if(keyError.includes("streetAndNumber")) {
                    keyError = "address_line"
                }

                if(keyError.includes("phone")) {
                    keyError = "phoneNumber"
                }

                if(keyError.includes("region")){
                    keyError = "reactStateNr"
                }

                if(keyError.includes("method")) {
                    keyError = "paymentMethodId"
                    setErrors(prevValues => ({
                        ...prevValues,
                        [keyError]: value
                    }))
                    continue
                }

                setErrors(prevValues => ({
                    ...prevValues,
                    userAddress: {
                        ...prevValues.userAddress,
                        [keyError]: value
                    }
                }))
            }

        }
    }

    const userAddressHandler = async (event) => {
        event.preventDefault()

        // console.log("get request payment", event)
        console.log("get request enteredInput", enteredInput)

        if(findInvalidInput(enteredAddress))
            {
                const { firstAndLastName, email, phoneNumber, ...deconstructInvalidList} = inputPaymentValidList 
                setEnteredInputIsInvalid(deconstructInvalidList)
            }

        let userAddressInfo = prepareInputForRequest(enteredInput, setEnteredInputIsInvalid, enteredInput.cityId, ctxValue.availableCities, enteredInput.stateId, ctxValue.availableStates)
        
        userAddressInfo = { ...userAddressInfo, 
            ['city']: enteredInput.city, 
            ['region']: enteredInput.state ?? "",
            ['unitNumber']: enteredInput.unitNumber ?? null,
            ['reactStateNr']: String(enteredInput.state_id), 
            ['reactCityNr']: String(enteredInput.city_id),
            ['streetNumber']:  Number(enteredInput.streetNumber)
        }
        
        const options = { url: '/api/v1/order/address', method: 'POST'}
        const ApiUserAddressOptions = ApiFetchPostOptions(options, userAddressInfo, {'X-Authorization': token})            
        console.log(":hallo")
        try {
            const response = await ApiFetch(ApiUserAddressOptions)
            const getResults = await response.json()

            if(!response?.ok)
            { 
                const errorResponse = Object.keys(getResults.errors).map((key) => [key, getResults.errors[key]])

                if(errorResponse.length > 0){
                    throw {body: {...getResults.errors }}
                }
                throw new HttpError("error handling failed", response.status)             
            }
            
            setErrors({userAddress: {}})

        } catch (error) {
            console.log({"got invalid auth":error})
            const errorHandled = errorHandlerPaymentUserAddressRequest(error, updateUserAddressErrors)
            if(!errorHandled) showBoundary(error)                   
        }
    }
  
    console.log("got new Errors", errors)
    const handleUserSelectLocation = (identifier, event) => {

        console.log({ errorsLength: errors.userAddress.length, errors: errors.userAddress})
        if(Object.keys(errors.userAddress).length !== 0)
            {
                setErrors({userAddress: {}})
            }

        if(identifier === 'state')
            {
                updateEnteredInputState(identifier, event)
                GetCity(countryid, event).then((result) => {
                    setCityList(result)
                })
                setInvalidTypeStatus(identifier, false)
                // set no return so both city and city_id will be handled by default / last method
            }
            
        if(identifier === 'city')
            {
                updateEnteredInputState('city', event)
                // set no return so both city and city_id will be handled by default / last method
            }

        if(identifier === 'city_id')
            {
                updateEnteredInputState('city_id', event)
                checkLocationStatus('location')
                
                setInvalidTypeStatus(identifier, false)
                setInvalidTypeStatus('city_id', false)
                // set no return so both city and city_id will be handled by default / last method
            }
    
        if(identifier === 'streetNumber')
            {
                console.log('streetNumber', event)
                const convertStrToInt = Number(event)
                const checkIfNumber = typeof convertStrToInt == 'number'
                
                if(!checkIfNumber){
                    setEnteredInputIsInvalid((prevValues) => ({
                        ...prevValues,
                        [identifier] : true
                    }))
                    return
                } else {
                    updateEnteredInputState(identifier, event)
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
                console.log("incoming input", event)
                updateEnteredInputState(identifier, event)
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
        return paymentInputBlurHandle(identifier, event, type, setEnteredInputIsInvalid)                  
    }

    const ctxValue = {
        currentUserState: enteredInput.state_id, // leave to check if there is undefined in LabelUserInfoField componenet, there is a check inside for this
        currentUserCity: enteredInput.city_id, // leave to check if there is undefined in LabelUserInfoField componenet, there is a check inside for this
        updateUserInput: handleUserSelectLocation,
        onBlur: inputBlurHandle,
    }

    console.log("error payment",errors)

    return(
        <>     
            <MainNavigation />
            <OrderContext.Provider value={ctxValue}>                    
               
                <UserDataModal 
                    dialog={dialogOpen}
                    closeDialog={closeUserAddressModalHandler} 
                    errors={errors.userAddress} 
                    enteredInput={enteredInput} 
                    formSubmit={userAddressHandler} 
                    handleKeyDown={handleKeyDown}
                    enteredInputIsInvalid={enteredInputIsInvalid}
                />                 

                <UserChoosePaymentModal dialog={dialogOpenPaymentMethod} closeDialog={closeUserPaymentMethodModalHandler} paymentMethodOptions={paymentMethodOptions} />

                <section className="flex-col shadow-md w-full bg-slate-100 py-5 rounded-md px-3 md:w-4/5 md:ml-auto md:mr-auto sm:mx-2 sm:px-5 md:grid md:mx-2 md:shadow-xl">

                    <h1 ref={pushRef}className={`pt-3 pb-6 mt-12 text-2xl text-center`} >Address & Peronsal Information</h1>
                    {userData?.userInfo && userData?.userAddress && 
                    <UserOrderInfoForm 
                        errorClass={`${findInvalidOrErrorInput(enteredAddress, errors.userAddress) && 'border-red-300'}`}
                        userAddressModalHandler={userAddressModalHandler} 
                        enteredInput={enteredInput}
                        user={userData?.userInfo} 
                        address={userData?.userAddress} 
                    />}

                    <h1 ref={pushRef} className={`pt-3 pb-6 mt-8 text-2xl text-center`} >Choose Payment Method</h1>
                    <UserSelectPaymentMethodForm
                        errorClass={`${!enteredInput.paymentMethodId && 'border-red-300'} ${errors.method && 'border-red-300'}`}
                        symbol={enteredInput.paymentMethodId}
                        paymentMethodModalHandler={userPaymentMethodModalHandler}
                        selectedType={enteredInput.paymentMethodName}
                    />

                    {enteredInput?.paymentMethodId && <section className='grid flex-col md:justify-items-center'>
                        <section className={`border-4 rounded-lg py-4 mt-4 sm:w-full md:w-3/5 hover:bg-slate-200 ${enteredInputIsInvalid.iban ? 'border-red-300' : 'border-slate-300' }`}>
                            <h2 ref={pushRef} className={`text-center ${enteredInputIsInvalid.iban && 'text-rose-600'}`}>please enter your IBAN/ bank account number </h2><br />
                            <span className='flex justify-center'>
                                <label>
                                    <input id='iban' type="text" onChange={(e) => updateEnteredInputState('iban',e.target.value)} onBlur={(e) => validateAndSetStatus( e, setInvalidTypeStatus)} />
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