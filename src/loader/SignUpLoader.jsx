import { GetState } from "react-country-state-city/dist/cjs"
import { countryid } from "../js/util/auth"
import { getLocalStorageItem } from "../js/util/getUtil"

export async function SignUpLoader(){
    const nameStorageItem = 'new_user'
    const stateList = await GetState(countryid)
    const userStoredFormData = getLocalStorageItem(nameStorageItem)

    return {stateList, nameStorageItem, userStoredFormData}
}