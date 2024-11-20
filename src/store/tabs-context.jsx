import { createContext, useReducer, useContext } from "react"

const TabsContext = createContext({
    tabNumber: 0,
})

const initialState = {
    tabNumber: 0,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_TAB_NUMBER':
            return {...state, tabNumber: action.payload}
        default:
            return state
    }
  }


export const TabsProvider = ({children}) =>  {
    
    const [state, dispatch] = useReducer(reducer, initialState)
    
    return (
        <>
            <TabsContext.Provider value={{ state, dispatch }}>
                {children}
            </TabsContext.Provider>
        </>
    )
}

export const useTabsContext = () => useContext(TabsContext)