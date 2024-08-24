import React from 'react'
import { Link, Form, Navigate, useNavigate } from 'react-router-dom'
import TextWithLineBreaks from "../ui/text/TextWithLineBreaks"
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons"
import { getAuthToken } from '../../js/util/auth'
import classes from "./OrderCard.module.css"
import { ApiFetch,
    ApiFetchPostOptions,
} from '../../js/util/postUtil.js'

// export default function OrderCard({id,name, description,category, duration, durationLength, price, directOrPeriodic }){
export default function OrderCard(props){

    const token = getAuthToken()
    const navigate = useNavigate()
    // const id = props['@id']

    const postRequest = async (data) => {
        try {
            const options = { url: '/api/v1/order/create', method: 'POST'}
            const ApiOptions = ApiFetchPostOptions(options,data, {'X-Authorization': 'Bearer ' + token})            
            const response = await ApiFetch(ApiOptions)
            const getResults = await response.json()
        
            if(!response.ok)
            { //if(response.status >= 400 && response.status <= 600)
                throw {message:'Api select order error', code: response.status}
            }

            const redirectTo = getResults.redirect

            console.log({redirectTo})
            navigate(getResults.redirect, {replace: true})

        } catch (error) {

            if(
                error.response != undefined && 
                error.response != '' &&
                !error.response.errors.error
            )
            {
                error.response.errors instanceof Array &&
                error.response.errors.map((error) => {
                    setErrors((prevValues) => {
                        return {
                            ...prevValues,
                            [error.property] : error.message
                        }
                    })
                })
            } else {

                if(error.response instanceof Object){
                    const arrayProperties = error.response.errors.property[0]
                    const messageError = error.response.errors.message
                    
                    setErrors((prevValues) => {
                        return {
                            ...prevValues,
                            [arrayProperties] : messageError
                        }
                    })
                } else {
                    if(error.code === 401){
                        localStorage.removeItem('auth')
                        navigate("/sign-up", {replace: true}) 
                    }
                }
            }

        }
    }

    function handleSubmit(event) {
        event.preventDefault()       
        const sku = event.target.subscription.value
        console.log({sku})
        // const requestData = reconstructPostInput(enteredInput, pw)
        // foundInvalidInputData(enteredInputIsInvalid)
        postRequest({sku})
    }
    
    return(
        <>
            <section className={`${classes.cardSubscription} flex flex-col max-w-sm p-6 bg-white border border-gray-200 rounded-lg my-2 shadow dark:bg-gray-200 dark:border-gray-700 sm:mx-2`}>
                    <h1 className="text-2xl text-center">{props.name}</h1>
                    <section className={`${classes.spSection} sp-section border-1 rounded-md bg-gray-300 px-4 py-6 my-2 border-l-zinc-500 text-center`}>
                        <Box
                            marginBottom={-2}
                            height={{ xs:'8rem', sm:'8rem', md:'9rem', lg:'10rem'}}
                            display= "flex"
                            flexDirection= "column"
                            justifyContent= "center"
                            sx={{
                                overflow: 'auto',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                             }}
                        >
                            <section className="text-center">
                                <span className="pr-2 text-5xl">€</span>
                                {props.directOrPeriodic != 0 && <span className="text-5xl">{props.price / props.durationLength}</span>}
                                {props.directOrPeriodic != 1 && <span className="text-5xl">{props.price}</span>}
                            </section>
                            {props.directOrPeriodic != 0  &&
                            <>
                                <div className="text-sm mt-0.5"><span>per </span><span className="font-extrabold">{props.duration}</span><br />
                                    <span className="font-extrabold">{props.price}</span>
                                    <span className="font-semibold"> for </span>
                                    <span className="font-extrabold">{props.durationLength + ' ' + (props.durationLength && props.duration + '\'s')}</span>
                                </div>
                            </>}
                            {props.directOrPeriodic != 1 && 
                            <>
                            <div className="text-sm mt-0.5">
                                <span className="font-semibold">one time pay</span>
                                <br />
                                <span className="font-semibold">valid for </span>
                                <span className="font-extrabold">{(props.durationLength === 0 ? 1 : props.durationLength) + ' ' + props.duration + '\'s'} </span> 
                            </div>
                            </>}
                            {props.directOrPeriodic != 1 &&
                            <>
                                <span className="line-clamp-3 text-sm">{props.description}</span>
                            </>}
                        </Box>                        
                    </section>
                    {/* <Link className={`${classes.spAllRefBtns}`} to="/contact">
                        <button className="rounded-md mb-5 py-4 px-6 first-button">
                            <span className="">Free Trail</span> 
                            <FontAwesomeIcon icon={faArrowRightLong} className={`${classes.spHiddenFaIcon} pl-2`} />
                        </button>
                    </Link> */}
                        <form onSubmit={(e) => handleSubmit(e)} className={classes.spAllRefBtns}>
                            <button className="rounded-md mb-5 py-4 px-6 first-button">
                                <span className="">Free Trail</span> 
                                <FontAwesomeIcon icon={faArrowRightLong} className={`${classes.spHiddenFaIcon} pl-2`} />
                                <input
                                    className={`w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} 
                                    name={props.category}
                                    type="hidden"
                                    value="trail"
                                    placeholder='Free Trail Subscription'
                                />
                            </button>
                        </form>
                    {/* {token ? */}
                        <form onSubmit={(e) => handleSubmit(e)} method="post" className={classes.spAllRefBtns}>
                            <button>
                                <span className="">Order Now </span>
                                <FontAwesomeIcon icon={faArrowRightLong} className={`${classes.spFaIcon} pl-2`} />  
                                <input
                                    className={`w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} 
                                    name={props.category}
                                    type="hidden"
                                    value={props.sku}
                                    placeholder={`${props.category}: ${props.name}`}
                                />
                            </button>
                        </form>
                    {/* // <Link className={classes.spAllRefBtns} to="/payment">
                    //     <button className="rounded-md mb-5 py-4 px-6 second-button">
                    //         <span className="">Order Now </span>
                    //         <FontAwesomeIcon icon={faArrowRightLong} className={`${classes.spFaIcon} pl-2`} />                        
                    //     </button>
                    // </Link>
                    // :
                    // <Link className={classes.spAllRefBtns} to="/sign-up">
                    //     <button className="rounded-md mb-5 py-4 px-6 second-button">
                    //         <span className="">Order Now </span>
                    //         <FontAwesomeIcon icon={faArrowRightLong} className={`${classes.spFaIcon} pl-2`} />                        
                    //     </button>
                    // </Link> */}

                    <section className="sp-last text-center">
                        <section className="py-5">
                            order description: {props.description}
                        </section>
                        <section className="py-5">
                        </section>
                    </section>
            </section>
        </>
    )
}