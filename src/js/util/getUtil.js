import { prepPaymentRequestFields } from "./auth"

export function setStorageUserSelectedSubscription(jsonToObj) {

    const isObj = typeof jsonToObj === 'object'

    // console.log({useEffectCheck: isObj, lines: jsonToObj, seetype: typeof jsonToObj})
    if(!isObj){
        return 
    }

    for (const [key, value] of Object.entries(jsonToObj)){
        const productDetails = value.productDetails
        const hasPropertySubscriptionDetails = productDetails.hasOwnProperty('subscriptionDetails')

        hasPropertySubscriptionDetails && setLocalStorageItem(`selected_subscription_${key}`,{
            name: productDetails.description,
            start: productDetails.subscriptionDetails.productSubscriptionStart,
            end: productDetails.subscriptionDetails.productSubscriptionEnd,
            amount: productDetails.subscriptionDetails.subscriptionAmount,
            length: productDetails.subscriptionDetails.subscriptionLength,
            time_unit: productDetails.subscriptionDetails.subscriptionTimeUnit,
        })
    }
}

export function getUserInfoObjOrStorageData(name){
    const storedValues = localStorage.getItem(name)
    
    if(!storedValues){
        return prepPaymentRequestFields
    }
    
    return JSON.parse(storedValues) 
}  

export function ApiFetchGetOptions(url,headerOptions = null) {
    return {
        url: url, 
        method: 'GET',
        headers: {
            "Content-Type":"application/json",
            ...headerOptions
        },
    }
}

export function setLocalStorageItem(name,data){
    localStorage.setItem(name, JSON.stringify(data))
}

export function getLocalStorageItem(name){

    return localStorage.getItem(name) != null ? JSON.parse(localStorage.getItem(name)) : null
}

export function deleteLocalStorageItem(name){
    localStorage.removeItem(name)
}

