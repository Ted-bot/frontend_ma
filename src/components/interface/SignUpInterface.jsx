// import { useState} from 'react'
import LabelNameInput from "../ui/input/LabelNameInput"

// eslint-disable-next-line react/prop-types
export default function CreateInterfaceForm({array}) {

    // eslint-disable-next-line react/prop-types
    // const inputRef = useRef(array.map(() => createRef()))

    // const [storeUserInput, setStoreUserInput] = useState({
    //     firstName: '',
    //     lastName: '',
    //     password: '',
    //     conversion: '',
    //     gender: '',
    //     phone: '',
    //     dateOfBirth: null
    // })

    // function inputHandler(identifier, event) {
    //     // event.preventDefault()
    //     // console.log(storeUserInput)

    //     setStoreUserInput((previousValues) => ({
    //         ...previousValues,
    //         [identifier]: event.target.value
    //     }))
    // }

        return array.map((item) => (
        // let dynamicNameChange =  item.name
        <LabelNameInput 
            name={item.name}
            type={item.type}
            key={Math.floor(Math.random() * 1000)}
            // ref={inputRef.current[index]}
            // onChange={(event) => inputHandler(item.name, event)}
            // value={storeUserInput[item.name]}
            {...item}
        />
        ))
}