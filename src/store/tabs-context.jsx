import { createContext, useReducer, useContext } from "react"

const TabsContext = createContext({
    tabNumber: 0,
    loggedIn: false
})

const initialState = {
    tabNumber: 0,
    loggedIn: false,
    loggedOut: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_TAB_NUMBER':
            // console.log('gotNewTAbsNumber', action.payload)
            return {...state, tabNumber: action.payload}
        case 'USER_LOGGED_IN':
            console.log('userLoggedIn', action.payload)
            if(action.payload === false) return {...state, loggedIn: action.payload, loggedOut: true}
            return {...state, loggedIn: action.payload}
        case 'USER_LOGGED_OUT':
            // console.log('userLoggedIn', action.payload)
            return {...state, loggedOut: action.payload}
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