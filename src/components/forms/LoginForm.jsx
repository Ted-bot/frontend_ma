import LabelNameInput from '../ui/input/LabelNameInput.jsx'
import { useState } from 'react'
import { findAndUpdateInvalidList } from '../../js/util/postUtil.js'
import { useLogin, useNotify, Login} from 'react-admin'

export default function LoginForm() {

    const typeEmail = 'email'
    const typePassword = 'password'
    
    // const navigate = useNavigate()

    const [errors, setErrors] = useState('')
    const [enteredInput, setEnteredInput] = useState({email: '', password : ''})
    const [enteredInputIsInvalid, setEnteredInputIsInvalid] = useState({email: '', password : ''})

    function inputHandle(identifier, value){
            // console.log({ [identifier] : event.target.value})
            setEnteredInput((prevValues) => {
                return {
                    ...prevValues,
                    [identifier]: value
                }
            })
    }

    function inputBlurHandle(identifier, event){
        if(identifier == 'email')
            {
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : (!event.includes('@') || event == '' || event === null) ? true : false
                }))
            }

        if(identifier == 'password' || identifier == 'phone' || identifier == 'conversion')
            {
                setEnteredInputIsInvalid((prevValues) => ({
                    ...prevValues,
                    [identifier] : (event == '') ? true : false
                }))
            }
    }

    const InterfaceConfiguration = {
        title: 'Login',
        buttonname: 'Submit',
        setItems : [
            { name: 'Email', id: 'email', type: typeEmail, placeholder: 'Enter E-mail', value: enteredInput.email, required: true, error: errors.email, onChange: (e) => inputHandle('email', e.target.value), onBlur : (e) => inputBlurHandle('email', e.target.value)},
            { name: 'Password', id: 'password', type: typePassword, placeholder: 'Enter Password', required: true, error: errors.password, onChange: (e) => inputHandle('password', e.target.value), onBlur : (e) => inputBlurHandle('password', e.target.value)}
        ]
    }

    const createInterfaceForm = (array) => {
        const createListItems = array.map((item) => (
            <LabelNameInput 
                name={item.name}
                type={item.type}
                key={item.id}
                {...item}
            />
        ))
        return createListItems
    } 

    

    // const postRequest = async (data) => {
    //     try {
            
    //         const apiOptions = {url: '/api/v1/login', method: 'POST'}
    //         const prepareQuery = ApiFetchOptions(apiOptions,data)
            
    //         console.log({prepareQuery: prepareQuery})

    //         const res = await ApiFetch(prepareQuery)

    //         if(!res.ok) //if(response.status >= 400 && response.status <= 600)
    //         {
    //             // const errorJson = await res.json()
    //             const getResultError = await res.json()
    //             console.log({errorPost: getResultError})
    //             throw new PostError('Api Login error', getResultError)
    //         } 
            
    //         console.log({total_response:res})
    //         localStorage.setItem('auth', res)
    //         navigate('/dashboard', {replace: true})

    //     } catch (error) {

    //         if(error.response != undefined ){
    //             if(error.response.errors != undefined){
    //                 setErrors(error.response.errors)
    //             }
    //         } else {
    //             console.log(error)
    //         }
                        
    //     }
    // }

    const login = useLogin()
    const notify = useNotify()

    // function handleSubmit(event, enteredInput, enteredInputIsInvalid) {
    function handleSubmit(event, enteredInput, enteredInputIsInvalid) {
        event.preventDefault()
        const email = enteredInput.email
        const password = enteredInput.password
        console.log(enteredInput)
        findAndUpdateInvalidList(enteredInputIsInvalid)
        // postRequest(enteredInput)
        login({ email, password }).catch((error) => {
            if(error.response != undefined ){
                    if(error.response.errors != undefined){
                        setErrors(error.response.errors)
                    }
                } else {
                    // "code":401,"message":"JWT Token not found"
                    console.log(error)
                }
            notify('Invalid email or password')
            }
        )
    }

    return (
        <>
        <Login>
            <section className="flex flex-col items-center shadow-md bg-slate-100 py-24 rounded-md px-3 sm:mx-4 w-full sm:px-5 sm:w-4/5 md:px-3 md:shadow-xl">
                
                <h1 className="pt-3 pb-6 text-2xl">{InterfaceConfiguration.title}</h1>
                
                <section className='flex justify-center'>
                    {errors && <p className="text-red-500 text-xs italic py-3">{errors} </p>}
                </section>
                
                <form onSubmit={(event) => handleSubmit(event, enteredInput, enteredInputIsInvalid)} name='login' id='login' className="flex flex-wrap w-full max-w-lg">
                    
                    {/* <section className="flex flex-wrap -mx-3 mb-6"> */}
                       {createInterfaceForm(InterfaceConfiguration.setItems)}
                    {/* </section> */}

                    <button type="submit" className="w-full py-3 mt-10 bg-[#063970] rounded-md
                        font-medium text-white uppercase
                        focus:outline-none hover:shadow-none"
                    >
                        {InterfaceConfiguration.buttonname}
                    </button>
                </form>

            </section>
        </Login>
        </>
    )
}