import LabelNameInput from '../ui/input/LabelNameInput.jsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PostError } from '../../js/error/PostError.js'
import { foundInvalidInputData } from '../../js/util/postUtil.js'
// import { getAuthToken } from '../js/util/auth.js'

export default function LoginForm() {

    const typeEmail = 'email'
    const typePassword = 'password'
    
    const navigate = useNavigate()

    const [errors, setErrors] = useState({email: '', password : ''})
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

    const postRequest = async (data) => {
        console.log({req_input:data})
        try {
            const response = await fetch("/api/v1/login",{ 
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(data)
            })
        
            if(response.ok)
            {
                const reqResults = await response.json()
                console.log({total_response:reqResults})
                localStorage.setItem('auth', reqResults)
                // navigate('/', {replace: true})
            } else { //if(response.status >= 400 && response.status <= 600)
                const errorJson = await response.json()
                throw new PostError(response, errorJson)
            }
        } catch (error) {

            if(error.backendReport != undefined && Array.isArray(error.backendReport.errors) && error.backendReport.errors.sql_state == null)
            {
                error.backendReport.errors.map((item) => {
                    console.log({test: item})
                    setErrors((prevValues) => {
                        return {
                            ...prevValues,
                            [item.property] : item.message
                        }
                    })
                })
            }
            else if(error.backendReport != undefined && Object.keys(error.backendReport.errors).length === 4) {
                setErrors(() => {
                    return {
                        [error.backendReport.errors.property[0]]: error.backendReport.errors.message
                    }
                })
            } else {
                console.log(error)
            }
        }
    }

    function handleSubmit(event, enteredInput, enteredInputIsInvalid) {
        event.preventDefault()
        
        console.log(enteredInput)
        foundInvalidInputData(enteredInputIsInvalid)
        postRequest(enteredInput)
    }

    return (
        <>
            <section className="flex flex-col items-center shadow-md bg-slate-100 py-5 rounded-md px-3 sm:mx-4 w-full sm:px-5 sm:w-4/5 md:px-3 md:shadow-xl">
                
                <h1 className="pt-3 pb-6 text-2xl">{InterfaceConfiguration.title}</h1>
                
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
        </>
    )
}