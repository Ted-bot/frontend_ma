import { json } from "react-router-dom"

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
    const ApiOptions = ApiFetchGetOptions('/api/v1/order',{'X-Authorization': 'Bearer ' + token})
        const response = await ApiFetch(ApiOptions)
        const getResults = await response.json()        
        
        // if(!getResults.lines){
        if(!response.ok){
            console.log({ response : response})
            throw {error: 'Not Found!'}
        }   

        return getResults
}