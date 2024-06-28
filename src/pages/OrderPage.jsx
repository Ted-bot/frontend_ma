import FeatureCardsWrap from '../components/wraps/client/FeatureCardsWrap.jsx' 
import OrderInterface from '../components/interface/OrderInterface.jsx'

export default function OrderPage(){
    const wrapName = 'Choose AccessCard for our events'
    const OrderList = {
        
    }

    return(
        <>
            <FeatureCardsWrap name={wrapName}>
                <OrderInterface />
            </FeatureCardsWrap>
        </>
    )
}