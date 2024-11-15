export function paymentInputBlurHandle(identifier, event, type, setEnteredInputIsInvalid) {
     const regexSearchInt = /^\d+$/
     const regexSearchText = /^[A-Za-z]+$/
    if(identifier === 'unitNumber') return
    
    if(type === 'text')
        {
            // console.log({text: event, type})
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : regexSearchText.test(event.target.value) ? false : true
            }))
            return
        }  
        
    if(type === 'firstAndLastName')
        {
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                // [identifier] : regexSearchFirstAndLastName.test(event.target.value) ? false : true
                [identifier] : event !== "" ? false : true
            }))
            return
        }  

    if(type === 'number')
        {
            // console.log({regex: event, type})
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : regexSearchInt.test(event.target.value) ? false : true
            }))
            return
        }  
        
    if(type === 'location')
        {
        console.log({locationEvent:event})
        setEnteredInputIsInvalid((prevValues) => ({
            ...prevValues,
            [identifier] : (event === '') ? true : false
        })) 
    }

    setEnteredInputIsInvalid((prevValues) => ({
        ...prevValues,
        [identifier] : (!event) ? true : false
    }))            
}

