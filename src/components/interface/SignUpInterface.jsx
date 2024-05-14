import LabelNameInput from "../ui/input/LabelNameInput"

// eslint-disable-next-line react/prop-types
export default function CreateInterfaceForm({array}) {

        return array.map((item) => (
        <LabelNameInput 
            name={item.name}
            type={item.type}
            key={item.id}
            {...item}
        />
        ))
}