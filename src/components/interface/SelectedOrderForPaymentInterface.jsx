import OrderClosureInput from "../ui/input/OrderClosureInput"
import { getLocalStorageItem } from "../../js/util/getUtil"

export default function SelectedOrderForPaymentInterface({latestOrder}){


    return latestOrder.map((orderLine, key) => {
                
                const localStorageSubscription = getLocalStorageItem(`selected_subscription_${key}`)

                return <OrderClosureInput
                    key={key}
                    name={orderLine.description}
                    totalPrice={orderLine.totalAmount.value}
                    price={orderLine.unitPrice.value}
                    qty={orderLine.quantity}
                    subscriptionData={localStorageSubscription}
                />
            }
        )
}