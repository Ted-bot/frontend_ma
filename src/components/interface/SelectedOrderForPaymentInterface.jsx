import OrderClosureInput from "../ui/input/OrderClosureInput"

export default function SelectedOrderForPaymentInterface({latestOrder}){

    return latestOrder.map((orderLine, key) => (
                <OrderClosureInput
                    key={key}
                    name={orderLine.description}
                    totalPrice={orderLine.totalAmount.value}
                    price={orderLine.unitPrice.value}
                    qty={orderLine.quantity}
                    subscriptionAmount={orderLine.productDetails.subscriptionDetails.subscriptionAmount}
                    durationSubscription={orderLine.subscriptionLength}
                    subscriptionType={orderLine.productDetails.subscriptionDetails.productSubscription}
                    startSubscription={orderLine.productDetails.subscriptionDetails.productSubscriptionStart}                    
                    endSubscription={orderLine.productDetails.subscriptionDetails.productSubscriptionEnd}
                />
            )
        )
}