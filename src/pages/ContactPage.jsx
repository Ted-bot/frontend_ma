import React from "react"

import MainContentWrap from "../components/wraps/client/MainContentWrap"

import classes from "./ContactPage.module.css"

export default function ContactPage() {

    return (
        <>
            <MainContentWrap name="Contact Page">
                <h1 className="flex justify-center w-full font-semibold text-4xl mb-8">Founder Of Black Dragon Martial Arts</h1>
                <section className="flex justify-center w-full p-24 sm:h-screen sm:px-12 md:align-top lg:align-top 2xl:align-top md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2" >
                    <img 
                        className="object-cover max-w-full h-auto drop-shadow-md rounded-md" 
                        src="https://img.freepik.com/free-photo/woman-with-poster-with-drawing-head_1134-457.jpg?t=st=1724330998~exp=1724334598~hmac=cce84bd38036441f0d1ecc130df6bd7d1876867d0f506f541252cb28dd35ff26&w=1380" 
                        alt="Founder of Organisation" 
                    />
                </section>
                <section className={`${classes.spFirstArticle} flex w-full p-8 h-screen md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2`}>
                    <article className="text-lg pt-20">
                        As the founder I believe that these days there is a lack of knowlegde how to defend your self. <br />
                        Not perse in physical but also mentally, as for example people get in to arguments randomly because, <br />
                        Lack of Self controll which allows them to get triggered, offended and go into attack mode, withour <br />
                        really looking at the situation and understanding the dangers, could be of personal situations <br />
                        But neither here or there they are setting up a chaotic situation where by a dangerous situation can happen. <br />
                        ...
                    </article>

                </section>
                <section className={`${classes.spFirstArticle} flex flex-col px-8 justify-center w-full`}>
                    <h1 className="flex justify-center">Before Signin Up</h1><br />
                    <article className="flex justify-center">
                    You might have quetions before subscribing to Black Dragon Marial Arts. <br />
                    Contact me on my number 0612345678, and ask freely regarding joining, and what to expect from both parties <br />
                    If you feel comfortable I personally would like to invite you to a couple free training session with us<br />
                    we will inform you how what my goal is and would like to know yours before joining us <br />
                    After two training sessions with us we would like to know if are becoming part of the school <br />
                    I am very exited to meet new people and to teach what I dearly like to do. <br />
                    ...
                </article></section>
            </MainContentWrap>
        </>
    )
}