export function paymentInputBlurHandle(identifier, event, type, setEnteredInputIsInvalid) {

    if(identifier === 'unitNumber') return
    
    if(type === 'text')
        {
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : regexSearchText.test(event.target.value) ? false : true
            }))
            return
        }  
        
    if(type === typeFirstAndLastName)
        {
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                // [identifier] : regexSearchFirstAndLastName.test(event.target.value) ? false : true
                [identifier] : event.target.value !== "" ? false : true
            }))
            return
        }  

    if(type === 'number')
        {
            console.log({regex: event.target.value})
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
            [identifier] : (event.target.value == '') ? true : false
        })) 
    }

    setEnteredInputIsInvalid((prevValues) => ({
        ...prevValues,
        [identifier] : (!event.target.value) ? true : false
    }))            
}

