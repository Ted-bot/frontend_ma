import LabelUserInfoFieldInput from '../ui/input/LabelUserInfoFieldInput'

export default function UserOrderInfoInterface({array}) {

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