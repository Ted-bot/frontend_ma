import LabelNameInput from "../ui/input/LabelNameInput"

// eslint-disable-next-line react/prop-types
export default function CreateInterfaceForm({array}) {

        return array.map((item) => (
        <LabelNameInput 
            name={item.name}
            type={item.type}
            key={Math.floor(Math.random() * 1333)}
            // ref={inputRef.current[index]}
            // onChange={(event) => inputHandler(item.name, event)}
            // value={storeUserInput[item.name]}
            {...item}
        />
        ))
}