import { useState, useEffect } from 'react'
import { 
    ApiFetchGetOptions,
    ApiFetch,
    getToken
 } from "../../js/util/postUtil"

import AddressForm from "../../components/forms/admin/AddressForm"
import OrderForm from "../../components/forms/admin/SelectedOrderForPaymentForm"

const PaymentPage = () => {

    useEffect(() => {
        ApiRequest()
    }, [])

    const token = getToken()
    const [userOrder, setUserOrder] = useState(null)

    const ApiRequest = async () => {
        const ApiOptions = ApiFetchGetOptions('/api/v1/order',{'X-Authorization': 'Bearer ' + token})
        const getResults = await ApiFetch(ApiOptions)
        const response = await getResults.json()

        if(!response.lastOrder){
            console.log({ response : response})
            throw new {error: 'Not Found!'}
        }

        console.log({ responseShopOrder: response })       
        
        setUserOrder(response) 
    }

    return (
        <>
            <AddressForm />
            <OrderForm latestOrder={userOrder} />
        </>
    )
}

export default PaymentPage