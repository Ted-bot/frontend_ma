import { useContext, useEffect, useCallback, useState } from "react"
import { StoreContext } from "../../store/store-context"

export const initialValue = {
    loggedIn: '',
    loggedOut: '',
    tabs: 0
}

const useStore = (
    key = '', 
    initialValue = '',
    storeInLocalStorage = true) => {

        const { store, setStore } = useContext(StoreContext);

        const initializeState = useCallback(() => {
            if (storeInLocalStorage && typeof window !== "undefined") {
                const storedValue = localStorage.getItem(key);
                return storedValue !== null ? JSON.parse(storedValue) : initialValue;
            }
            return initialValue || null;
        }, [key, initialValue, storeInLocalStorage]);

        const [isLoading, setIsLoading] = useState(true);
        const [localValue, setLocalValue] = useState(initializeState)        

        useEffect(() => {
            setIsLoading(true);
        
            if (storeInLocalStorage && localValue !== undefined) {
                localStorage.setItem(key, JSON.stringify(localValue));
            }
            setStore(prevStore => ({
                ...prevStore,
                [key]: localValue,
            }));
        
            setIsLoading(false);
        }, [key, localValue, storeInLocalStorage, setStore])

        const setStateInStore = useCallback(
            (stateInStore = initialValue) => {
                setLocalValue(stateInStore)
                setStore(prevStore => ({
                    ...prevStore,
                    [key]: stateInStore,
                }));
        
                if (storeInLocalStorage) {
                    localStorage.setItem(key, JSON.stringify(stateInStore))
                }
            },
            [key, storeInLocalStorage, setStore]
        )

        return [store[key] !== undefined ? (store[key]) : (localValue), setStateInStore, isLoading]
}
    
export default useStore