import { useState, useEffect, useCallback, useMemo } from 'react'
import MainContentWrap from '../components/wraps/client/MainContentWrap.jsx' 
import OrderInterface from '../components/interface/OrderInterface.jsx'
import { ApiFetch,
    ApiFetchGetOptions,
   getToken,
   setLocalStorageItem,
   getLocalStorageItem
  } from '../js/util/postUtil.js'

export default function OrderPage(){
    const wrapName = 'Choose AccessCard for our events'
    const OrderList = {}
    const [products, setProducts] = useState();
    
    useEffect(() => {
      requestAvailableProducts()
      .then((response) => {
  
        console.log({responseAvailableProducts: response.collection})
        
        setProducts(response.collection)
        // const storeData = {
        //   id: response.id,
        //   firstName: response.firstName,
        //   lastName: response.lastName,
        //   email: response.email
        // }

        // Object.entries(storeData).map(([key, value]) => {
        //   console.log({key, value})
        //   setDashBoardData((prevValues) => ({
        //     ...prevValues,
        //     [key] : value
        //   }))
        // })
  
        // setLocalStorageItem(itemLocalstorage, storeData)
      })
      .catch((error) => {
        console.log({userFetchError: error})
  
      })
    },[])

    const requestAvailableProducts = useCallback(
       async () => {
        const GetUrl = '/api/products?page=1&duration=month'
        // const requestOptions = ApiFetchGetOptions(GetUrl, {'X-Authorization': 'Bearer ' + token})
        const requestOptions = ApiFetchGetOptions(GetUrl)
        const request = ApiFetch(requestOptions)
    
        try {
          
          const response = await request
          const getResults = await response.json()
    
          // console.log({reponse_api_dashboard: response})
          console.log({reponse_api_dashboard: getResults})
    
          if(!response.ok){ // 401
            throw {response: { message: getResults.message, code: getResults.status }}
          }

          console.log({responseAvailableProducts: response.collection})
    
          return { collection: getResults['hydra:member'] }
        
        } catch (error) {
    
          if(error.response != undefined ){
            error.response.code != undefined && setErrors(error.response.message)
          }
          console.log({ error_request_userdata: error })
          // return 
        }        
      }, [])

    return(
        <>
            <MainContentWrap name={wrapName}>
                {products && <OrderInterface products={products} />}
            </MainContentWrap>
        </>
    )
}