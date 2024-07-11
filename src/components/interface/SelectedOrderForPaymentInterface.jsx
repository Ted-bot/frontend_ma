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
                    name={orderLine.productName}
                    totalPrice={orderLine.totalProductPrice}
                    price={orderLine.productPrice}
                    qty={orderLine.quantity}
                    // {...orderline}
                    // clickHandler={}
                />
            )
        )
}