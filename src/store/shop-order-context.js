import { createContext } from "react"

export const OrderContext = createContext({
    currentUserState: '', 
    currentUserCity: '', 
    updateUserInput: () => {},
    onBlur: () => {},
})