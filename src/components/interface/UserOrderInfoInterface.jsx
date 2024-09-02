import LabelUserInfoFieldInput from '../ui/input/LabelUserInfoFieldInput'

// eslint-disable-next-line react/prop-types
export default function UserOrderInfoInterface({array}) {

    console.log({paymentArray: array})

        return array.map((item) => (
        <LabelUserInfoFieldInput 
            name={item.name}
            type={item.type}
            key={item.id}
            error={item?.error}
            errorRegion={item?.errorRegion}
            {...item}
        />
        ))
}