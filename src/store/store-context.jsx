import { createContext } from "react"

export const StoreContext = createContext({
    store: {},
    setStore: () => {},
  })