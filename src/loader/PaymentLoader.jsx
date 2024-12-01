import { ApiFetch } from "../js/util/postUtil.js"
import {ApiFetchGetOptions, deleteLocalStorageItem, setLocalStorageItem  } from "../js/util/getUtil.js"
import inMemoryJwt from "../js/util/inMemoryJwt.js"
import { redirect } from "react-router-dom"
// import useStore from "../hooks/store/useStore.jsx"

export async function PaymentLoader()
{
    // const [error, setError] = useStore('error')
    // const [message, setMessage] = useStore('message')
    const deleteStorageValeus = ['amount', 'locale', 'description', 'order_number', 'EUR', 'lines', 'user_address']

    deleteStorageValeus.forEach(key => {
        deleteLocalStorageItem(key)
        // console.log({deleteSuccessExample_Lines: localStorage.getItem(`${key}`), key})
    })

    const token = inMemoryJwt.getToken()
    const ApiOptions = ApiFetchGetOptions('/api/v1/order/payment',{'X-Authorization': `Bearer ${token}`})
    const response = await ApiFetch(ApiOptions)
    const getResults = await response.json()       

    if(!response.ok){
        if(data.code === 401 && data.message === 'Invalid JWT Token'){
            setLocalStorageItem('message',"We couldn't verify you if you still here, please try loggin again")
            setLocalStorageItem('error',true)
            navigate('/')
        }
        redirect('/')
    }   

    return getResults
}