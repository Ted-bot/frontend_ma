import React from "react"
export const FallBackRender = ({error, resetErrorBoundary}) => {

    const messagebasedOneStatus = (status) => {
        if(status >= 500) return "Our apology seems like something went wrong from our side! Please try reloading the Page"
        if(status < 500) return "Oeps! seems like we cant handle your request! Please try reloading the Page"
        return "We have an issue that occured, please try and refresh!"
    }

    const messageToUser = messagebasedOneStatus(error.status)

    console.log({doIgetREsponse: messageToUser, message: error.message, status: error.status})
    return (
        <>
            <section className="min-h-screen flex items-center justify-center">
                <section className="text-center">
                    <h1 className="text-5xl font-semibold text-rose-600 mb-4">{messageToUser}</h1>
                    <p className="text-2xl text-gray-700 font-semibold">{error.message ?? (error.title ? error.title : "An error has occured! Please try reloading the page!")}</p>
                    {/* <p className="text-2xl text-gray-700 font-semibold">{error.message ?? (error.title ? error.title : "An error has occured! Please try reloading the page!")}</p> */}
                    <button className="mt-4 bg-red-400 border-2 p-2 border-l-pink-500 rounded-md text-yellow-200 hover:bg-rose-800" onClick={resetErrorBoundary}> 
                        Reload Page
                    </button>
                </section>
            </section>
        </>
    )
}