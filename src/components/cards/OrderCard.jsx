import React from 'react'
import { useNavigate } from 'react-router-dom'
// import TextWithLineBreaks from "../ui/text/TextWithLineBreaks"

import { ApiFetch, ApiFetchPostOptions} from '../../js/util/postUtil.js'
import inMemoryJwt from '../../js/util/inMemoryJwt.js'

import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons"
import useStore from '../../hooks/store/useStore.jsx'
import classes from "./OrderCard.module.css"

export default function OrderCard({
    name, 
    directOrPeriodic,
    price,
    durationLength,
    duration,
    description,
    category,
    sku,
}){
    const token = inMemoryJwt.getToken()
    const navigate = useNavigate()
    const [message, setMessage] = useStore('message', false)
    const [error, setError] = useStore('error', false)
    const postRequest = async (data) => {
        try {
            const options = { url: '/api/v1/order/create', method: 'POST'}
            const ApiOptions = ApiFetchPostOptions(options,data, {'X-Authorization': token})            
            const request = await ApiFetch(ApiOptions)
            const response = await request.json()
        
            if(!request.ok) throw {message:response.message, code: response.code}

            const redirectTo = response.redirect

            navigate(redirectTo, {replace: true})

        } catch (error) {

            console.log("GOt Error", error)
            if(error instanceof Object && error.code > 399){
                // const arrayProperties = error.response.errors.property[0]
                const messageError = "Login or Create a profile to get access!"
                // const messageError = error.message

                setMessage(messageError)
                setError(true)

                navigate("/sign-up", {replace: true}) 
                
                // setErrors((prevValues) => {
                //     return {
                //         ...prevValues,
                //         ['error'] : messageError
                //     }
                // })
            }
        }
    }

    function handleSubmit(event) {
        event.preventDefault()       
        const sku = event.target.subscription.value
        console.log({sku})
        // const requestData = reconstructPostInput(enteredInput, pw)
        // findAndUpdateInvalidList(enteredInputIsInvalid)
        postRequest({sku})
    }
    
    return(
        <>
            <section className={`${classes.cardSubscription} flex flex-col max-w-sm p-6 bg-white border border-gray-200 rounded-lg my-2 shadow dark:bg-gray-200 dark:border-gray-700 sm:mx-2`}>
                    <h1 className="text-2xl text-center">{name}</h1>
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
                                {directOrPeriodic != 0 && <span className="text-5xl">{price / durationLength}</span>}
                                {directOrPeriodic != 1 && <span className="text-5xl">{price}</span>}
                            </section>
                            {directOrPeriodic != 0  &&
                            <>
                                <div className="text-sm mt-0.5"><span>per </span><span className="font-extrabold">{duration}</span><br />
                                    <span className="font-extrabold">{price}</span>
                                    <span className="font-semibold"> for </span>
                                    <span className="font-extrabold">{durationLength + ' ' + (durationLength && duration + '\'s')}</span>
                                </div>
                            </>}
                            {directOrPeriodic != 1 && 
                            <>
                            <div className="text-sm mt-0.5">
                                <span className="font-semibold">one time pay</span>
                                <br />
                                <span className="font-semibold">valid for </span>
                                <span className="font-extrabold">{(durationLength === 0 ? 1 : durationLength) + ' ' + duration + '\'s'} </span> 
                            </div>
                            </>}
                            {directOrPeriodic != 1 &&
                            <>
                                <span className="line-clamp-3 text-sm">{description}</span>
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
                                    name={category}
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
                                    name={category}
                                    type="hidden"
                                    value={sku}
                                    placeholder={`${category}: ${name}`}
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
                            order description: {description}
                        </section>
                        <section className="py-5">
                        </section>
                    </section>
            </section>
        </>
    )
}