// delete this file

import { createContext, useContext, useReducer } from "react"
import { prepRequestFields } from "../js/util/auth"
import { useLocaleState } from "react-admin"
import { setLocalStorageItem } from "../js/util/getUtil"

const UserFormContext = createContext(prepRequestFields)

const initialState = {};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_GENERAL_USER_DATA':
      return { ...state, ...action.payload }
    default:
        return state
  }
}

export const UserFormContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserFormContext.Provider value={{ state, dispatch }}>
      {children}
    </UserFormContext.Provider>
  );
};

export const useUserFormContext = () => useContext(UserFormContext)