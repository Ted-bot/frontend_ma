import { CreateContext } from "react-admin"

const OrderContext = createContext({
    availableStates: [],
    availableCities: []
})