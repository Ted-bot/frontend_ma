import { useState, useEffect, useCallback, useRef } from 'react'
import { 
    ApiFetchGetOptions,
    ApiFetchPostOptions,
    ApiFetch,
    setLocalStorageItem,
    getToken
 } from "../../js/util/postUtil"
 import UserDataModal from '../../components/modal/UserDataModal'
 import UserChoosePaymentModal from '../../components/modal/UserChoosePaymentModal'

import UserOrderInfoForm from "../../components/forms/client/UserOrderInfoForm"
import SelectedOrderForPaymentInterface from '../../components/interface/SelectedOrderForPaymentInterface'

import { getLocalStorageItem } from '../../js/util/postUtil'
import { alpha } from "@mui/material"
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import UserSelectPaymentMethodForm from '../../components/forms/client/UserSelectPaymentMethodForm'

import { OrderContext } from '../../store/shop-order-context'

// import IconIdeal from "../../assets/ideal.svg"
// import IconCredit from "../../assets/creditcard.svg"
// import IconPaypal from "../../assets/paypal.svg"

const PaymentPage = () => {

    useEffect(() => {
        ApiRequest()
    }, [])

    const regexSearch = /^[A-Za-z]+$/
    const [paymentType, setPaymentType] = useState({
            ideal : false,
            credit_card : false,
            pay_pal : false,
        })
    
    const getFirstTruthyItem = (obj) => Object.keys(obj).find((i) => obj[i] === 'true')

    const inputHandle = (identifier,event) => {
        event.preventDefault()
        console.log({paymentTypSelected: paymentType})
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
            },
        ],
    }

    const dialogUserAddress = useRef()
    const dialogUserPaymentMethod = useRef()
    const token = getToken()
    const [currencyType, setCurrencyType] = useState('EUR')
    const [userData, setUserData] = useState({
        userInfo: {},
        userAddress: {},
        userOrder: {},
    })

    const [symbol, setSymbol] = useState(null)

    function updateUserData(identifier, data){
        setUserData((prevState) => ({
            ...prevState,
            [identifier]: data
            }
        )
    )}
    
    const ApiRequest = async () => {
        const ApiOptions = ApiFetchGetOptions('/api/v1/order',{'X-Authorization': 'Bearer ' + token})
        const getResults = await ApiFetch(ApiOptions)
        const response = await getResults.json()        
        
        if(!response.lines){
            console.log({ response : response})
            throw new {error: 'Not Found!'}
        }
        
        console.log({ responseShopOrder: response })       
        
        setLocalStorageItem(response.curreny.name,response.curreny.symbol)

        console.log({userData: response.user})
        console.log({userAddress: response.address})
        
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
    // const currencyType = 'EUR'
    const paymentCurrency = getLocalStorageItem(currencyType)
    
    const userAddressModalHandler = useCallback(
        (event) =>  { //unnessecary async removed
            // console.log({eventSelected: event})
            dialogUserAddress.current.open()
        }
    )

    const paymentMethodModalHandler = useCallback(
        (event) => {
            dialogUserPaymentMethod.current.open()
        }
    )

    const choosePaymentFormSub = useCallback(
        (event) => {
            const options = {
                [event.target[0].id] : event.target[0].value,
                [event.target[1].id]: event.target[1].value,
                [event.target[2].id]: event.target[2].value
            }

            console.log({formSubmitionEvent: options})
            event.preventDefault()
            const selectedMethod = getFirstTruthyItem(options)
            setSymbol(selectedMethod)
            // console.log({formSubmition: event.target[0]})
        }
    )

    const userAddressHandler = async (event) => {
        event.preventDefault()

        let userAddressInfo = {}

        for (let i = 0; i < 7; i++){
            userAddressInfo = { ...userAddressInfo, [event.target[i].id]: event.target[i].value}
        }

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



        //     deleteLocalStorageItem(nameStorageItem)
        //     const reqResults = await response.json()
        //     setToken(reqResults)
        //     navigate('/dashboard') 
        //     // redirect

        } catch (error) {
        
        }
    }

    console.log({userData})

    return (
        <>
            <OrderContext.Provider>
                {userData?.userAddress?.reactStateNr != undefined && <UserDataModal ref={dialogUserAddress} formSubmit={userAddressHandler} user={userData.userInfo} address={userData.userAddress}/>}
                <UserChoosePaymentModal ref={dialogUserPaymentMethod} formAction={choosePaymentFormSub} paymentMethodOptions={paymentMethodOptions} />

                <section className="flex-col shadow-md w-full bg-slate-100 py-5 rounded-md px-3 sm:mx-2 sm:px-5 md:grid md:mx-2 md:shadow-xl">

                    <h1 className={`pt-3 pb-6 mt-12 text-2xl text-center`}>Address & Peronsal Information</h1>
                    {userData?.userInfo && userData?.userAddress && <UserOrderInfoForm userAddressModalHandler={userAddressModalHandler} user={userData.userInfo} address={userData.userAddress} />}

                    <h1 className={`pt-3 pb-6 mt-8 text-2xl text-center`}>Choose Payment Method</h1>
                    <UserSelectPaymentMethodForm symbol={symbol} paymentMethodModalHandler={paymentMethodModalHandler} />

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