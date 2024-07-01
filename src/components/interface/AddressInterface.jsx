import LabelAddressFieldInput from "../ui/input/LabelAddressFieldInput"

// eslint-disable-next-line react/prop-types
export default function AddressInterface({array}) {

    console.log({paymentArray: array})

        return array.map((item) => (
        <LabelAddressFieldInput 
            name={item.name}
            type={item.type}
            key={item.id}
            {...item}
        />
        ))
}