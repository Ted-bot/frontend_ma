import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from "@mui/material"
// import { useDataProvider } from 'react-admin'
import { ApiFetch,
  ApiFetchGetOptions,
 getToken,
 setLocalStorageItem,
} from '../../js/util/postUtil.js'

// eslint-disable-next-line react/prop-types
const UsersDashboardPage = () => {
    
    // const dataProvider = useDataProvider();
    const [dashboardData,setDashBoardData] = useState({name: '', id: ''})

    useEffect(() => {
      requestUserData(getToken())
      .then((response) => {
        const storeData = {
          name: response.name,
          id: response.id
        }
        const itemLocalstorage = 'user'

        setLocalStorageItem(itemLocalstorage, storeData)
        setDashBoardData(() => {
          return storeData
        })
      })
      .catch((error) => {
        console.log({userFetchError: error})
      })
  }, [])

  const requestUserData = async (token) => {
    const ApiOptions = {url:'/api/v1/dashboard/user', method: 'GET'}
    const requestOptions = ApiFetchGetOptions(ApiOptions, {'X-Authorization': 'Bearer ' + token})
    const request = ApiFetch(requestOptions)

    try {
      const response = await request
      const response_1 = await response.json()
      return { id: response_1.id, name: response_1.name }
    } catch (error) {
      return (console.log({ error_request_userdata: error }))
    }        
}
  
    return (
    <Card>
      <CardHeader title={dashboardData.name + " Dashboard"} />
      <CardContent>{dashboardData.name}</CardContent>
      <CardContent>{dashboardData.id}</CardContent>
  </Card>
    )
  }

  export default UsersDashboardPage