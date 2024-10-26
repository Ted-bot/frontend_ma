import { useStore } from "react-admin"
import { GetCity, GetState } from "react-country-state-city/dist/cjs"
import { countryid } from "../js/util/auth"


export const LocationState = async (id, cityId) => {
    const statesData = await GetState(id)
    const citiesData = await GetCity(id,cityId)
    return {statesData, citiesData}
}

export const LocationCity = async (id) => {
    const citiesData = await GetCity(countryid, id)
    // const [city, setCity] = useStore('location.cities', citiesData)
    return citiesData
}