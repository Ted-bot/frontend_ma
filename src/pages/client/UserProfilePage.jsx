import { useState, useEffect, useCallback } from 'react'

import { useLoaderData, Form, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from "@mui/material"
import CssBaseline from '@mui/material/CssBaseline'
import { ApiFetch } from '../../js/util/postUtil.js'
import { AdminGuesser,
  hydraDataProvider,
  hydraSchemaAnalyzer,
  ResourceGuesser,
  fetchHydra,
} from '@api-platform/admin'
import { useGetIdentity, useAuthProvider } from 'react-admin'


import {ApiFetchGetOptions, getLocalStorageItem} from "../../js/util/getUtil.js"
import { dataProvider } from '../../dataProvider/main/DataProvider.jsx'
// import { authProvider } from '../../dataProvider/main/AuthProvider.jsx'

import { getAuthToken } from '../../js/util/auth.js'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

const UserProfilePage = () => {  
  const {data, isPending, error} = useGetIdentity()
  const itemLocalstorage = 'user'
  const [errors, setErrors] = useState('')
  const [userData, setUserData] = useState({user: {}})

  function setData(identifier, data){
    setUserData((prevValues) => ({
        ...prevValues,
        [identifier]: data
    }))
  }
  const email = getLocalStorageItem('email')
  
  useEffect(() => {
    dataProvider.getOneSubscription('users', email).then((response) => setData('subscription',response))
    // setData('user',data)
  },[])

  // console.log({test: identity.identity, subscription: identity})
  // console.log({DataSet: userData})
  console.log({AuthUser: userData, error: error, isPending: isPending,checkUSerName: userData.firstName})
  return (
    <Card>
      <CardHeader sx={{ mx: 2 }} title={`${data?.firstName} Dashboard`} />
      
      <CardContent>
        {errors && <p className="text-red-500 text-5xl italic py-3 "> {errors} </p>}
      </CardContent>
      <CardContent className='text-center'>
        {
          userData?.subscription && <p className="text-red-500 text-3xl italic py-3 ">
            Your Subscription valid<br />
            From: {userData.subscription.dateStart} <br />
            Untill: {userData.subscription.dateEnd}
          </p>
        }
      </CardContent>
      <Divider variant="middle" component="div"  />
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

  export default UserProfilePage