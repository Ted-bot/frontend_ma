import { useState, useEffect, useCallback, useRef } from 'react'
import { 
    ApiFetchGetOptions,
    ApiFetch,
    setLocalStorageItem,
    getToken
 } from "../../js/util/postUtil"
 import UserOrderModal from '../../components/modal/UserOrderModal'

import UserOrderInfoForm from "../../components/forms/admin/UserOrderInfoForm"
import SelectedOrderForPaymentForm from "../../components/forms/admin/SelectedOrderForPaymentForm"

const PaymentPage = () => {

    useEffect(() => {
        ApiRequest()
    }, [])

    const dialog = useRef()
    const token = getToken()
    const [currencyType, setCurrencyType] = useState(null)
    const [userOrder, setUserOrder] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [userAddress, setUserAddress] = useState(null)

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

        setUserInfo(response.user)
        setUserAddress(response.address)
        setUserOrder({
            orderId: response.orderId,
            currency: response.currency,
            lastOrder: response.lines,
            orderTaxPrice: response.orderTaxPrice,
            orderTotalAmount: response.amount.value,
            orderTotalProductPrice: response.orderTotalProductPrice,
        }) 
    }

    const handleSelectEvent = useCallback(
        (event) =>  { //unnessecary async removed
            // console.log({eventSelected: event})

            
            dialog.current.open()
        })

    return (
        <>
            {userAddress?.reactStateNr != undefined && <UserOrderModal ref={dialog} user={userInfo} address={userAddress}/>}
            {/* {userAddress?.reactStateNr != undefined && <UserOrderInfoForm handleClick={handleSelectEvent} user={userInfo} address={userAddress} />} */}
            {userAddress?.reactStateNr != undefined && <SelectedOrderForPaymentForm latestOrder={userOrder} handleClick={handleSelectEvent} user={userInfo} address={userAddress} />}
        </>
    )
}

export default PaymentPage