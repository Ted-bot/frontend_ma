import { useLoaderData } from "react-router-dom"
import FormWrap from "../components/wraps/client/FormWrap.jsx"
import SignUpForm from "../components/forms/SignUpForm.jsx"
// import LoginForm from "../components/forms/LoginForm.js

export default function SignUpPage() {

    const data = useLoaderData()
    const {stateList, nameStorageItem, userStoredFormData} = data
    // console.log({stateList, nameStorageItem, userStoredFormData})

    return (
        <>
            <FormWrap>
                <SignUpForm stateList={stateList} nameStorageItem={nameStorageItem} userStoredFormData={userStoredFormData}/>
            </FormWrap>
        </>
    )
}