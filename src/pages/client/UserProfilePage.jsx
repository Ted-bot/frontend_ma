import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthenticated, Title, useAuthState, useGetIdentity, useRedirect } from 'react-admin'

import {getLocalStorageItem} from "../../js/util/getUtil.js"
import { dataProvider } from '../../dataProvider/main/DataProvider.jsx'


import { Card, CardContent, CardHeader } from "@mui/material"
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import inMemoryJwt from '../../js/util/inMemoryJwt.js'
import useStore from '../../hooks/store/useStore.jsx'

const UserProfilePage = () => {  
  // const itemLocalstorage = 'user'
  useAuthenticated()
  const navigate = useNavigate()
  const redirect = useRedirect()
  const [userLoggedIn, setUserLoggedIn, isLoading] = useStore('loggedIn')
  const {data, isPending, error} = useGetIdentity()

  const [errors, setErrors] = useState('')
  const [userData, setUserData] = useState({user: {}})
  const email = getLocalStorageItem('email')

  function setData(identifier, data){
    setUserData((prevValues) => ({
        ...prevValues,
        [identifier]: data
    }))
  }

  useEffect(() => {
    data?.email && setUserLoggedIn(true)

    if(inMemoryJwt.getValidSubscription() && data?.email != null){
      dataProvider.getOneSubscription('user_subscription', data?.email).then((response) => {
        setData('subscription',{...response})
        console.log("got Subcsription", response)
      })
    }
  },[])

  

  return (
    <Card>
      <Title title="Dashboard" />
      <CardHeader sx={{ mx: 2 }} title={`${data?.firstName} Dashboard`} />
      
      
        {errors && <CardContent><p className="text-red-500 text-5xl italic py-3 "> {errors} </p></CardContent>}
      
      
        {
          userData?.subscription?.start 
          ? <CardContent className='text-center border-none'><p className="text-red-500 text-3xl italic py-3 ">
            Your Subscription valid<br />
            From: {userData.subscription.start} <br />
            Untill: {userData.subscription.end}
          </p></CardContent>
          : ''
        }
      
      <Divider variant="middle" component="div"  />
      <CssBaseline />
      <CardContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <Grid container direction="column" sx={{ flexGrow: 1}} >
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
                  {userData?.subscription?.sessions_followed ?? 0}
                </h1>
              </Box>
              {/* <Divider variant="middle" component="div" /> */}
            </Grid>
            
            <Grid container direction="column" sx={{ flexGrow: 1 }} >
              <Box 
                display='block'
                my={2}
                height= {{ xs:'4rem', sm:'4rem', md:'8rem', lg:'10rem'}}
                alignContent="center"
              >
                <h1 className='text-center py-2 text-md text-orange-300 md:text-xl lg:text-2xl lg:py-10'>
                  Tokens
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
                {userData?.subscription?.tokens_owned ?? 0}
                </h1>
              </Box>    
              {/* <Divider variant="middle" component="div"  /> */}
            </Grid>

            <Grid container direction="column" sx={{ flexGrow: 1 }} >
              <Box
                display='block'
                my={2}
                height= {{ xs:'4rem', sm:'4rem', md:'8rem', lg:'10rem'}}
                alignContent="center"
              >
                <h1 className='text-center py-2 text-md text-orange-300 md:text-xl lg:text-2xl lg:py-10'>
                  Training Level
                </h1>
              </Box>
              <Divider variant="middle" component="div"  />
              <Box 
                display='block'
                my={2}
                height= {{ xs:'4rem', sm:'4rem', md:'8rem', lg:'10rem'}}
                alignContent="center"
                mx={'auto'}
              >
                <h1 className='text-center text-md md:text-xl lg:text-2xl lg:py-10'>                  
                  {
                    userData?.subscription?.next_session.next_training_day
                    ? <>
                      <p>
                        {userData?.subscription?.next_session.next_training_day}    
                      </p>
                      <p>
                      <br />
                        {userData?.subscription?.next_session?.start + " - " + userData?.subscription?.next_session?.end}
                      </p>
                                      
                    </>
                    : 0 
                  }
                  <br />
                  {userData?.next_session?.start ?? ''}
                </h1>
              </Box>
              {/* <Divider variant="middle" component="div"  /> */}
            </Grid>
          </Box>
      </CardContent>
      
      <CardContent>
        <section className="flex justify-center mt-2 px-4 text-md md:text-xl lg:text-2xl lg:py-10">
          <section className='w-1/2 text-center translate-y-8 -translate-x-4 md:translate-y-4 lg:translate-y-8'>
              Next Class
          </section>
          <Divider orientation="vertical" flexItem />
          <section className='w-1/2 text-center'>
          {
                    userData?.subscription?.next_session.next_training_day
                    ? <>
                        <p>
                          {userData?.subscription?.next_session.next_training_day}    
                        </p>
                        <p>
                        <br />
                          {userData?.subscription?.next_session?.start + " - " + userData?.subscription?.next_session?.end}
                        </p>
                    </>
                    : <p className='text-sm pl-2 lg:text-lg'> You have no tokens currently.
                        <br />
                      Go to the shop and get tokens.
                      <br />
                      Then select a day to join a class inside the calendar
                    </p>
                  }
              
          </section>
        </section>
      </CardContent>
  </Card>
    )
  }

  export default UserProfilePage