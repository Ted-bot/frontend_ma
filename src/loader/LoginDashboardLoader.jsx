import { useState } from 'react'
import { Form, redirect, useNavigate} from 'react-router-dom'
import { useLogin } from 'react-admin'
import { Box } from '@mui/material'

const LoginDashboardLoader = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState(false)
    const login = useLogin()

    const handleSubmit = e => {
        e.preventDefault()        
        // .then((response) => (response))
        login({ email, password })
        .then((response) => {  navigate('/dashboard') })
        .catch((error) => {
            if(error?.message) {
                setErrors(error.message) 
            } else {
                setErrors("unknown error, please try again later") 
            }
        })
    }

    return (
        <Box 
            display="flex"
            flexDirection="column"
            zIndex={1}
            minHeight="100vh"
            // width="100%"
            backgroundColor="theme.palette.background.default"
            // backgroundColor="theme.palette.background.default"
            position="relative"
        >
            {/* <section className="flex flex-col w-full items-center shadow-md bg-orange-100 py-24 rounded-md px-3 md:shadow-xl">
                <section  className={`w-full py-24 bg-orange-300 rounded-md md:w-1/2 lg:justify-center px-3 mb-6 md:mb-0`}> */}
                    
                    <section className='flex justify-center'>
                        {errors && <p className="text-red-500 text-xl italic py-3">{errors}</p>}
                    </section>

                    <Form onSubmit={handleSubmit} >
                        <input
                            className={`w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} 
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            placeholder='Enter E-mail'
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input
                            className={`w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} 
                            name="password"
                            type="password"
                            value={password}
                            autoComplete="current-password"
                            placeholder='Enter Password'
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button className="w-full py-3 mt-10 bg-[#063970] rounded-md
                            font-medium text-white uppercase
                            focus:outline-none hover:shadow-none hover:bg-[#4a8add]"
                        >
                            Login
                        </button>
                    </Form>
                {/* </section>
            </section> */}
        </Box>
    )
}

export default LoginDashboardLoader