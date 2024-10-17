import { useLoaderData } from "react-router-dom"
import FormWrap from "../components/wraps/client/FormWrap.jsx"
import SignUpForm from "../components/forms/SignUpForm.jsx"
// import LoginForm from "../components/forms/LoginForm.js

export default function SignUpPage() {

    const data = useLoaderData()
    const {stateList, storageNameNewUser, userStoredFormData} = data
    // console.log({stateList, storageNameNewUser, userStoredFormData})

    return (
        <>
            <FormWrap>
                <SignUpForm stateList={stateList} storageNameNewUser={storageNameNewUser} userStoredFormData={userStoredFormData}/>
            </FormWrap>
        </>
    )
}