import { useState, useEffect } from "react"
import { 
    getToken,
    ApiFetchGetOptions,
    ApiFetch
} from "../../js/util/postUtil"

export default function SelectedOrderForPaymentInterface(){

    const token = getToken()
    const ApiOptions = ApiFetchGetOptions({url: '/api/' ,},{'X-Authorization': 'Bearer ' + token})
    const response = ApiFetch(ApiOptions)
    
    return(
        <>
            <section>
                <section>
                    <h1>Selected order:</h1>
                </section>

            </section>

        </>
    )
}