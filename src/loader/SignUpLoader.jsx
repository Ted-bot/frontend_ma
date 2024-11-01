import { storageNameNewUser } from "../js/util/auth"
import { getLocalStorageItem } from "../js/util/getUtil"
import { getStates } from "../components/class/userData/FormHelper"

export async function SignUpLoader(){    
    const stateList = await getStates()
    const userStoredFormData = getLocalStorageItem(storageNameNewUser)

    return {stateList, storageNameNewUser, userStoredFormData}
}