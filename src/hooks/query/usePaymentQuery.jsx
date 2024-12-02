import { useQuery, QueryClient } from "react-query"
import { getLocalStorageItem, ApiFetchGetOptions } from "../../js/util/getUtil"
import { ApiFetch } from "../../js/util/postUtil"
import { HttpError } from "react-admin"
import inMemoryJwt from "../../js/util/inMemoryJwt.js"
import { dataProvider } from "../../dataProvider/main/DataProvider.jsx"

export const fetchUserOrderAddress = async () => {
    const token = inMemoryJwt.getToken()
    const ApiOptions = ApiFetchGetOptions(`/api/v1/order/payment`,{'X-Authorization': `Bearer ${token}`})    
    const request = await ApiFetch(ApiOptions)
    const userAddressData = await request.json()    

    if(!request.ok){    
        throw new HttpError('Excuse us, could Not Find a user address!', 404)          
    }   

    return userAddressData
}


export const fetchPublicCalendar = async () => {
    const ApiOptions = ApiFetchGetOptions(`/api/public/events`)    
    const request = await ApiFetch(ApiOptions)
    const response = await request.json()

    if(!request.ok){    
        throw new HttpError('Excuse us, Black Dragon Events Not Found!', 404, response)          
    }   

    console.log('pulicEventsCalendar', response)

    const publicBlackDragonEvents = response['member'].map((response) => ({
        id: response.id,
        title: response.title,
        start: new Date(response.startDate),
        end: new Date(response.endDate),
        resource: response.description,
    }))

    return {publicCalendar: publicBlackDragonEvents}
}

export const useUserAddressData = () => {
    const { data: userAddressData, status } = useQuery({
        queryFn: fetchUserOrderAddress,
        queryKey: ["userAddress"], 
        refetchOnWindowFocus: false,        
        // refetchInterval: 60000,
        // retry: 5,
    })

    console.log('User Address Data', userAddressData)
    return {userAddressData: userAddressData, status: status}
}

export const usePublicCalendar = () => {
    const { data: publicCalendar, status } = useQuery({
        queryFn: fetchPublicCalendar,
        queryKey: ["publicCalendar"], 
        refetchOnWindowFocus: false,        
        refetchInterval: 60000,
        retry: 5,
    })

    console.log('public Test Calendar', publicCalendar)

    return {publicCalendar: publicCalendar, status: status}
}
