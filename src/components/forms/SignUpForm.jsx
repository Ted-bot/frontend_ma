import { useState } from 'react'
import SignUpInterface from '../interface/SignUpInterface.jsx'

// import LabelNameInput from '../ui/input/LabelNameInput.jsx'

export default function SignUpForm() {

    const [checkedMale, setCheckedMale] = useState(false)
    const [checkedFemale, setCheckedFemale] = useState(false)
    // const [enteredInput, setEnteredInput] = useState({})

    const typeText = 'text'
    const typeEmail = 'email'
    const typePassword = 'password'
    const typePhone = 'tel'
    const typeDate = 'date'
    const typeCheckBox = 'checkbox'

    const stylesTextArea={
        width: "100%",
        paddingRight: '10px', 
        paddingLeft: '10px', 
        paddingTop: '3px'
      }

    const checkBoxHandle = (e) => {
        e.preventDefault()
        if(e.target.id !== 'male'){
            setCheckedFemale(true)
            setCheckedMale(false)
        } else {
            setCheckedFemale(false)
            setCheckedMale(true)
        }
    }

    const InterfaceConfiguration = {
        title: 'Sign Up',
        buttonname: 'Register',
        titleTextArea: 'Message',
        descriptionToJoinTextArea: 'What caught your interest to join our training sessions',
        setItems : [
            { name: 'FirstName', type: typeText, placeholder: 'first name'},
            { name: 'LastName', type: typeText, placeholder: 'last name'},
            { name: 'Email', type: typeEmail, placeholder: 'email'},
            { name: 'Male', type: typeCheckBox, defaultChecked: checkedMale, onChange: checkBoxHandle },
            { name: 'Female', type: typeCheckBox, defaultChecked: checkedFemale, onChange: checkBoxHandle },
            { name: 'Birthday', type: typeDate},            
            { name: 'PhoneNumber', type: typePhone, placeholder: 'phone number'}                ,
            { name: 'Password', type: typePassword, placeholder: 'passord'}
        ]
    }

    function handleSubmit(event) {
        event.preventDefault()
        const fd = new FormData(event.target)
        const enteredInput = Object.fromEntries(fd.entries())

        fetch("/api/register", { 
            method: "POST",
            headers: {
                "Content-Type":"application/json" 
            },
            body: JSON.stringify({enteredInput})
        })
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            console.log({ data: response })
            return response
        })
    }

    return (
        <>
            <section className="flex flex-col items-center shadow-md bg-slate-100 py-5 rounded-md px-3 sm:mx-4 w-full sm:px-5 sm:w-4/5 md:px-3 md:shadow-xl">

                <h1 className="pt-3 pb-6 text-2xl">{InterfaceConfiguration.title}</h1>

                <form onSubmit={handleSubmit} name='sign-up' id='sign-up'>

                    <section className="flex flex-wrap -mx-3 mb-6">
                       <SignUpInterface array={InterfaceConfiguration.setItems} />                        
                    </section>

                    <label className="w-full">
                        {InterfaceConfiguration.titleTextArea}
                        <textarea name="conversion" rows={4} cols={40} style={stylesTextArea} placeholder={InterfaceConfiguration.descriptionToJoinTextArea}/>
                    </label>

                    <button 
                        className="w-full py-3 mt-10 bg-[#063970] rounded-md
                        font-medium text-white uppercase
                        focus:outline-none hover:shadow-none"
                    >
                        {InterfaceConfiguration.buttonname}
                    </button>

                    <section className="flex justify-center pt-6 pb-4">
                        <p><a>Already have a account? Sign in here!</a></p>
                    </section>
                </form>
            </section>
        </>
    )
}