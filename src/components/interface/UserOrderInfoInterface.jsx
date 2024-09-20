import LabelUserInfoFieldInput from '../ui/input/LabelUserInfoFieldInput'

export default function UserOrderInfoInterface({array, handleKeyDown}) {

        return array.map((item) => (
        <LabelUserInfoFieldInput 
            name={item.name}
            type={item.type}
            handleKeyDown={handleKeyDown}
            key={item.id}
            error={item?.error}
            errorRegion={item?.errorRegion}
            {...item}
        />
        ))
}