import {useCallback} from 'react'
import {redirect} from 'react-router-dom'
// import {useState} from 'react'
import { PostError } from '../js/error/PostError.js'
import { getAuthToken } from '../js/util/auth.js'
import { setLocalStorageItem } from '../js/util/getUtil.js'

export function logoutAction(){

    const postRequest = useCallback(
        async () => {
        // console.log({req_input:data})
        try {
            const response = await fetch("/api/v1/logout",{ 
                method: "get",
                headers: {getAuthToken},
            })
        
            if(response.ok)
            {
                const reqResults = await response.json()
                console.log({total_response:reqResults})
                const contentParse = JSON.parse(reqResults)
                console.log({token_only: contentParse})

                setLocalStorageItem('auth', reqResults)
                // localStorage.setItem('auth', JSON.stringify(reqResults))
                redirect('/')
            } else { //if(response.status >= 400 && response.status <= 600)
                const errorJson = await response.json()
                throw new PostError(response, errorJson)
            }
        } catch (error) {
                console.log(error)
        }
    })

    postRequest()
}