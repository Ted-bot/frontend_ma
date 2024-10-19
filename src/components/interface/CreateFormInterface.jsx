import LabelNameInput from "../ui/input/LabelNameInput"

// eslint-disable-next-line react/prop-types
export default function CreateFormInterface({array}) {

        return array.map((item) => (
            <LabelNameInput
                key={item.id}
                {...item}
            />
        ))
}