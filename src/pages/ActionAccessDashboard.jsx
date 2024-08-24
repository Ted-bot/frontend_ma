import {redirect} from 'react-router-dom'
// import {useState} from 'react'
import { PostError } from '../js/error/PostError.js'
import { getAuthToken } from '../js/util/auth.js'

export function logoutAction(){

    const postRequest = async () => {
        // console.log({req_input:data})
        try {
            const response = await fetch("/api/v1/dashboard/user",{ 
                method: "get",
                headers: {getAuthToken},
            })
        
            if(response.ok)
            {
                const reqResults = await response.json()
                console.log({total_response:reqResults})
                const contentParse = JSON.parse(reqResults)
                console.log({token_only: contentParse})
                localStorage.setItem('auth', JSON.stringify(reqResults))
                redirect('/')
            } else { //if(response.status >= 400 && response.status <= 600)
                const errorJson = await response.json()
                throw new PostError(response, errorJson)
            }
        } catch (error) {
            localStorage.removeItem('auth')
            console.log({error, token: localStorage.getItem('auth')})
        }
    }

    postRequest()
    // localStorage.removeItem('auth')
    // return redirect('/')
}