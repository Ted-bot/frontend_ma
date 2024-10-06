import { useState } from 'react'
import { Form, redirect } from 'react-router-dom'
import { useLogin } from 'react-admin'
import { setAuthToken, deleteAuthToken } from '../../js/util/auth.js'
import { setLocalStorageItem, deleteLocalStorageItem } from '../../js/util/getUtil.js'



const LoginDashboardLoader = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState('')
    const login = useLogin()

    const handleSubmit = e => {
        e.preventDefault()
        
        login({ email, password })
        .then((response) => {
            return response.json()
        }).then((response) => {            
            redirect('/dashboard')
            console.log({ fullResponse: response, authToken: response.token })
        })
        .catch((error) => {

            console.log({ possible_401_status:error})
            // "code":401,"message":"JWT Token not found"
            if(error.response != undefined ){
                error.response.code != undefined && setErrors(error.response.message)
            }      
            
            if(error.response != undefined ){
                error.response.errors != undefined && setErrors(error.response.errors)
            }      
            redirect('/dashboard/login')      
        })
    }

    return (
            <section className="flex flex-col w-full items-center shadow-md bg-orange-100 py-24 rounded-md px-3 md:shadow-xl">
                <section  className={`w-full py-24 bg-orange-300 rounded-md md:w-1/2 lg:justify-center px-3 mb-6 md:mb-0`}>
                    
                <section className='flex justify-center'>
                    {errors && <p className="text-red-500 text-xs italic py-3">{errors} </p>}
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
                </section>
            </section>
    )
}

export default LoginDashboardLoader