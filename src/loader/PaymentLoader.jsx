import { ApiFetch } from "../js/util/postUtil.js"
import {ApiFetchGetOptions, deleteLocalStorageItem  } from "../js/util/getUtil.js"
import inMemoryJwt from "../js/util/inMemoryJwt.js"

export async function PaymentLoader()
{
    const deleteStorageValeus = ['amount', 'locale', 'description', 'order_number', 'EUR', 'lines', 'user_address']

    deleteStorageValeus.forEach(key => {
        deleteLocalStorageItem(key)
        // console.log({deleteSuccessExample_Lines: localStorage.getItem(`${key}`), key})
    })

    const token = inMemoryJwt.getToken()
    const ApiOptions = ApiFetchGetOptions('/api/v1/order/payment',{'X-Authorization': token})
    const response = await ApiFetch(ApiOptions)
    const getResults = await response.json()       

    if(!response.ok){
        throw {error: 'Not Found!'}           
    }   

    return getResults
}