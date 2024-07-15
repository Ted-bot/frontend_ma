import { useState, useEffect, Suspense } from 'react'
import { 
    ApiFetchGetOptions,
    ApiFetch,
    setLocalStorageItem,
    getToken
 } from "../../js/util/postUtil"

import UserOrderInfoForm from "../../components/forms/admin/UserOrderInfoForm"
import SelectedOrderForPaymentForm from "../../components/forms/admin/SelectedOrderForPaymentForm"

const PaymentPage = () => {

    useEffect(() => {
        ApiRequest()
    }, [])

    const token = getToken()
    const [currencyType, setCurrencyType] = useState(null)
    const [userOrder, setUserOrder] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [userAddress, setUserAddress] = useState(null)

    const ApiRequest = async () => {
        const ApiOptions = ApiFetchGetOptions('/api/v1/order',{'X-Authorization': 'Bearer ' + token})
        const getResults = await ApiFetch(ApiOptions)
        const response = await getResults.json()

        if(!response.lastOrder){
            console.log({ response : response})
            throw new {error: 'Not Found!'}
        }

        console.log({ responseShopOrder: response })       

        setLocalStorageItem(response.curreny.name,response.curreny.symbol)

        setUserInfo(response.user)
        setUserAddress(response.address)
        setUserOrder({
            orderId: response?.orderId,
            currency: response?.currency,
            lastOrder: response?.lastOrder,
            orderTaxPrice: response?.orderTaxPrice,
            orderTotalAmount: response?.orderTotalAmount,
            orderTotalProductPrice: response?.orderTotalProductPrice,
        }) 
    }

    return (
        <>
            {userAddress?.reactStateNr != undefined && <UserOrderInfoForm user={userInfo} address={userAddress} />}
            <SelectedOrderForPaymentForm latestOrder={userOrder} />
        </>
    )
}

export default PaymentPage