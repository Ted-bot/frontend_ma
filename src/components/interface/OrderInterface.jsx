import OrderCard from "../cards/OrderCard"

export default function OrderInterface({products}){

    return products.map((item) => {
        // console.log({id: item['@id']})
        const id = item.sku
        return <OrderCard
            key={id}
            {...item}
        />
    })
}