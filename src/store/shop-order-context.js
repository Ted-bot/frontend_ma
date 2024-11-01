import { createContext } from "react"

export const OrderContext = createContext({
    availableStates: [],
    availableCities: [],
    currentUserState: '', 
    currentUserCity: '', 
    updateUserInput: () => {},
    onBlur: () => {},
})