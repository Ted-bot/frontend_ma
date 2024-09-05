import { useState, useEffect, useCallback } from 'react'
import { redirect } from 'react-router-dom'
import { Card, CardContent, CardHeader } from "@mui/material"
import CssBaseline from '@mui/material/CssBaseline'
// import { useDataProvider } from 'react-admin'
import { ApiFetch,
  ApiFetchGetOptions,
 getToken,
 setLocalStorageItem,
 getLocalStorageItem
} from '../../js/util/postUtil.js'
import { getAuthToken } from '../../js/util/auth.js'
// import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
// import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

// eslint-disable-next-line react/prop-types
const UsersDashboardPage = () => {  
  // const dataProvider = useDataProvider();
  const [dashboardData,setDashBoardData] = useState({id: '', firstName: '', lastName: '', email: ''})
  const itemLocalstorage = 'user'
  const CurrentStateStorage = getLocalStorageItem(itemLocalstorage) != null ? getLocalStorageItem(itemLocalstorage) : null
  const token = getAuthToken()
  const [errors, setErrors] = useState('')

  const requestUserData = useCallback(
    async (token) => {
    const GetUrl = '/api/v1/dashboard/user'
    const requestOptions = ApiFetchGetOptions(GetUrl, {'X-Authorization': 'Bearer ' + token})
    const request = ApiFetch(requestOptions)

    try {
      
      const response = await request
      const getResults = await response.json()

      // console.log({reponse_api_dashboard: response})
      console.log({reponse_api_dashboard: getResults})

      if(!response.ok && response.status === 401){ // 401
        throw {response: { message: getResults.message, code: response.status }}
      }

      return { id: getResults.id, firstName: getResults.first_name, lastName: getResults.last_name, email: getResults.email }
    
    } catch (error) {

      if(error.response != undefined ){
        error.response.code != undefined && setErrors(error.response.message)
        throw {message: error.response.message}
      }
      console.log({ error_request_userdata: error })
      // return 
      }        
    }, [token]
  )

  useEffect(() => {
    console.log({tokenAvailable: token})
    requestUserData(token)
    .then((response) => {

      console.log({responseDashboardData: response})
      const storeData = {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email
      }

      console.log({data_before_insertion: response})
      Object.entries(storeData).map(([key, value]) => {
        console.log({key, value})
        setDashBoardData((prevValues) => ({
          ...prevValues,
          [key] : value
        }))
      })

      setLocalStorageItem(itemLocalstorage, storeData)
    })
    .catch((error) => {
      console.log({userFetchError: error})

    })
  },[])

  if(CurrentStateStorage != null)
  if(CurrentStateStorage.firstName != '' && dashboardData.firstName == ''){
    // useMemo(()=> {
        Object.entries(CurrentStateStorage).map(([key, value]) => {
        console.log({key, value})
        setDashBoardData((prevValues) => ({
          ...prevValues,
          [key] : value
        }))
      })
    // }, [CurrentStateStorage])
  }
  
  return (
    <Card>
      <CardHeader sx={{ mx: 2 }} title={`${dashboardData.firstName} Dashboard`} />
      
      <CardContent>
        {errors && <p className="text-red-500 text-5xl italic py-3 "> {errors} </p>}
        </CardContent>
      <CssBaseline />
      <CardContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <Grid 
              container 
              direction="column"
              sx={{ flexGrow: 1}}
              >
              <Box 
                  display='block'
                  my={2}
                  height= {{ xs:'4rem', sm:'4rem', md:'8rem', lg:'10rem'}}
                  alignContent="center"
              >
                <h1 className='text-center text-md text-orange-300 md:text-xl lg:text-2xl lg:py-10'>
                    Training 
                    <br />
                    sessions 
                    <br />
                    followed
                  </h1>
              </Box>
              <Divider variant="middle" component="div"  />
              <Box 
                display='block'
                my={2}
                height= {{ xs:'4rem', sm:'4rem', md:'8rem', lg:'10rem'}}
                alignContent="center"
              >
                <h1 className='text-center text-md md:text-xl lg:text-2xl lg:py-10'>
                  0
                </h1>
              </Box>
              <Divider variant="middle" component="div" />
            </Grid>
            
            <Grid 
              container
              direction="column"
              sx={{ flexGrow: 1 }}
            >
              <Box 
                display='block'
                my={2}
                height= {{ xs:'4rem', sm:'4rem', md:'8rem', lg:'10rem'}}
                alignContent="center"
              >
                <h1 className='text-center py-2 text-md text-orange-300 md:text-xl lg:text-2xl lg:py-10'>
                  Training 
                  <br />
                  Acces
                  <br />
                  Points
                </h1>
              </Box>
              
              <Divider variant="middle" component="div"  />
              
              <Box 
                display='block'
                my={2}
                height= {{ xs:'4rem', sm:'4rem', md:'8rem', lg:'10rem'}}
                alignContent="center"
              >
                <h1 className='text-center text-md md:text-xl lg:text-2xl lg:py-10'>
                  100
                </h1>
              </Box>    
              <Divider variant="middle" component="div"  />
            </Grid>

            <Grid 
              container
              direction="column"
              sx={{ flexGrow: 1 }}
            >
              <Box
                display='block'
                my={2}
                height= {{ xs:'4rem', sm:'4rem', md:'8rem', lg:'10rem'}}
                alignContent="center"
              >
                <h1 className='text-center py-2 text-md text-orange-300 md:text-xl lg:text-2xl lg:py-10'>
                  Next Class
                </h1>
              </Box>
              <Divider variant="middle" component="div"  />
              <Box 
                display='block'
                my={2}
                height= {{ xs:'4rem', sm:'4rem', md:'8rem', lg:'10rem'}}
                alignContent="center"
              >
                <h1 className='text-center text-md md:text-xl lg:text-lg lg:py-10'>                  
                  Wo 12 June
                  <br />
                  18:00
                </h1>
              </Box>
              <Divider variant="middle" component="div"  />
            </Grid>
          </Box>
      </CardContent>
      {/* <CardContent>
        <section className="px-4 text-md md:text-xl lg:text-2xl lg:py-10">
          Goals: {dashboardData.firstName}
          <br />
          Deadline: 07 Juli 2024
        </section>
        <section className='flex'>
          <section className='flex-col w-full'>
            <section className="px-4 py-4 text-center text-sm md:text-lg lg:text-xl">
              <section className='text-green-300'>
                Strength goal: 
              </section>
              7
            </section>
            <Divider variant="middle" component="div" />
            <section className="px-4 py-4 text-center text-sm md:text-lg lg:text-xl">
              <section className="text-red-300">
                Current level: 
              </section>
              6
            </section>
            <Divider variant="middle" component="div" />
          </section>
          <section className='flex-col w-full'>
            <section className="px-4 py-4 text-center text-sm md:text-lg lg:text-xl">
              <section className='text-green-300'>
                Endurance level: 
              </section>
              6
            </section>
            <Divider variant="middle" component="div" />
            <section className="px-4 py-4 text-center text-sm md:text-lg lg:text-xl">
              <section className="text-red-300">
                Current level: 
              </section>
              4
            </section>
            <Divider variant="middle" component="div" />
          </section>
          <section className='flex-col w-full'>
            <section className="px-4 py-4 text-center text-sm md:text-lg lg:text-xl">
              <section className='text-green-300'>
                Mental level: 
              </section>
              7
            </section>
            <Divider variant="middle" component="div" />
            <section className="px-4 py-4 text-center text-sm md:text-lg lg:text-xl">
              <section className="text-red-300">
                Current level: 
              </section>
              4
            </section>
            <Divider variant="middle" component="div" />
          </section>
        </section>
      </CardContent> */}
      <CardContent>
        <section className='px-4 text-md md:text-xl lg:text-2xl '>
          Training Session:
        </section>
        <section className="flex justify-center px-4 text-md md:text-xl lg:text-2xl lg:py-10">
          <section className='w-1/2 text-center'>
              Group
          </section>
          <Divider orientation="vertical" flexItem />
          <section className='w-1/2 text-center'>
              Not set in a group yet.
              <br />
              Sign up for a class to get set in a group
          </section>
        </section>
      </CardContent>
  </Card>
    )
  }

  export default UsersDashboardPage