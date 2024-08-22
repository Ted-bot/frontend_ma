import React from 'react'
import TextWithLineBreaks from "../ui/text/TextWithLineBreaks"
import Box from '@mui/material/Box'
import IconRight from "../../assets/IconRight"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons"
import "./fontAwesome.css"

export default function OrderCard({name, description, duration, durationLength, price, directOrPeriodic }){

    return(
        <>
            <section className="card-subscription flex flex-col max-w-sm p-6 bg-white border border-gray-200 rounded-lg my-2 shadow dark:bg-gray-200 dark:border-gray-700 sm:mx-2">
                    <h1 className="text-2xl text-center">{name}</h1>
                    <section className="sp-section border-1 rounded-md bg-gray-300 px-4 py-6 my-2 border-l-zinc-500 text-center">
                        <Box
                            marginBottom={-2}
                            height={{ xs:'8rem', sm:'8rem', md:'9rem', lg:'10rem'}}
                            display= "flex"
                            flexDirection= "column"
                            justifyContent= "center"
                            noWrap={true}
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
                                {/* <TextWithLineBreaks text={`per ${duration}`} /> */}
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
{/* hover:bg-green-600 hover:text-white bg-green-700*/}
                    <button className="sp-ref-all-btns rounded-md mb-5 py-4 text-gray-300 px-6 first-button" id="first-button">
                        <span className="">Free Trail</span>    
                        {/*  text-green-800 hover:text-text-green-300*/}
                        <FontAwesomeIcon icon={faArrowRightLong} className="sp-hidden-fa-icon pl-2" />
                    </button>
                    {/* hover:bg-green-700 hover:text-white */}
                    <button className="sp-ref-all-btns rounded-md mb-5 py-4 px-6 second-button" id="second-button">   
                        {/* underline underline-offset-8 decoration-2 text-green-700 */}
                        <span className="">Order Now </span>
                        {/*  hover:text-text-orange-300  text-green-800*/}
                        <FontAwesomeIcon icon={faArrowRightLong} className="sp-fa-icon pl-2" />                        
                    </button>
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