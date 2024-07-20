import { useState, useEffect } from "react"
import { 
    getToken,
    ApiFetchGetOptions,
    ApiFetch
} from "../../js/util/postUtil"
import OrderClosureInput from "../ui/input/OrderClosureInput"

export default function SelectedOrderForPaymentInterface({latestOrder}){

    console.log({enterInputPayment: latestOrder})
    return latestOrder.map((orderLine, key) => (
        // console.log({line: orderLine.productName})
                <OrderClosureInput
                    key={key}
                    name={orderLine.name}
                    totalPrice={orderLine.totalAmount.value}
                    price={orderLine.unitPrice.value}
                    qty={orderLine.quantity}
                    subscriptionType={orderLine.productDetails.subscriptionDetails.productSubscription}
                    startSubscription={orderLine.productDetails.subscriptionDetails.productSubscriptionStart}                    
                    endSubscription={orderLine.productDetails.subscriptionDetails.productSubscriptionEnd}                    
                    // {...orderline}
                    // clickHandler={}
                />
            )
        )
}