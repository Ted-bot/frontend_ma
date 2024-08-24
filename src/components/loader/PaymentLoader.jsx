import { json, redirect } from "react-router-dom"

import { 
    ApiFetchGetOptions,
    ApiFetchPostOptions,
    ApiFetch,
    setLocalStorageItem,
    getToken
 } from "../../js/util/postUtil"

export async function PaymentLoader()
{
    const token = getToken()
    const ApiOptions = ApiFetchGetOptions('/api/v1/order/payment',{'X-Authorization': 'Bearer ' + token})
    const response = await ApiFetch(ApiOptions)
    const getResults = await response.json()       

    if(!response.ok){
        throw {error: 'Not Found!'}           
    }   

    return getResults
}