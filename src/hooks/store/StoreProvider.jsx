import { useState } from "react"
import { StoreContext } from "../../store/store-context"

const StoreProvider = ({ children }) => {
    const [store, setStore] = useState({});
   
    return <StoreContext.Provider value={{ store, setStore }}>{children}</StoreContext.Provider>
};
   
export { StoreProvider }