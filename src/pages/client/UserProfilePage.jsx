import { useState, useEffect } from 'react'
import { Title, useAuthState, useGetIdentity } from 'react-admin'

import {getLocalStorageItem} from "../../js/util/getUtil.js"
import { dataProvider } from '../../dataProvider/main/DataProvider.jsx'

import { Card, CardContent, CardHeader } from "@mui/material"
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import inMemoryJwt from '../../js/util/inMemoryJwt.js'


const UserProfilePage = () => {  
  const { isPending: authPending, authenticated: userAuthenticated } = useAuthState()
  const {data, isPending, error} = useGetIdentity()
  if(authPending) return <section>...loading</section>

  // if(userAuthenticated) return <section>...user Authenticated</section>
  const itemLocalstorage = 'user'
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
    if(inMemoryJwt.getValidSubscription()){
      dataProvider.getOneSubscription('user', email).then((response) => setData('subscription',response))
    }
  },[])

  if(userAuthenticated){
  return (
    <Card>
      <Title title="Dashboard" />
      <CardHeader sx={{ mx: 2 }} title={`${data?.firstName} Dashboard`} />
      
      <CardContent>
        {errors && <p className="text-red-500 text-5xl italic py-3 "> {errors} </p>}
      </CardContent>
      <CardContent className='text-center'>
        {
          userData?.subscription?.start && <p className="text-red-500 text-3xl italic py-3 ">
            Your Subscription valid<br />
            From: {userData.subscription.start} <br />
            Untill: {userData.subscription.end}
          </p>
        }
      </CardContent>
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
              <Divider variant="middle" component="div" />
            </Grid>
            
            <Grid container direction="column" sx={{ flexGrow: 1 }} >
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
                {userData?.subscription?.tokens_owned ?? 0}
                </h1>
              </Box>    
              <Divider variant="middle" component="div"  />
            </Grid>

            <Grid container direction="column" sx={{ flexGrow: 1 }} >
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
                  {userData?.subscription?.next_session?.next_training_day ?? userData?.subscription}
                  <br />
                  {userData?.subscription?.next_session?.start ?? ''}
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
  }

  export default UserProfilePage