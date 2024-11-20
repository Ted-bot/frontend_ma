import FormWrap from "../components/wraps/client/FormWrap.jsx"
import SignUpForm from "../components/forms/SignUpForm.jsx"
import { storageNameNewUser } from "../js/util/auth"
import { getLocalStorageItem } from "../js/util/getUtil"
import MainNavigation from "../components/navigations/MainNavigation.jsx"
export default function SignUpPage() {

    return (
        <>
            <MainNavigation />
            <FormWrap>
                <SignUpForm storageNameNewUser={storageNameNewUser} userStoredFormData={getLocalStorageItem(storageNameNewUser)}/>
            </FormWrap>
        </>
    )
}