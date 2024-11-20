export function paymentInputBlurHandle(identifier, event, type, setEnteredInputIsInvalid) {
     const regexSearchInt = /^\d+$/
     const regexSearchText = /^[A-Za-z]+$/
    
     if(identifier === 'unitNumber') return
        
    if(type === 'tel')
        {
            const tel = event.target.value
            
            setEnteredInputIsInvalid((prevValues) => ({
                ...prevValues,
                [identifier] : (tel.length >= 11) ? false : true
            }))
            return
        }  
    
    if(type === 'text')
    {
        setEnteredInputIsInvalid((prevValues) => ({
            ...prevValues,
            [identifier] : regexSearchText.test(event.target.value) ? false : true
        }))
        return
    }  

    if(type === 'email')
    {
        const email = event.target.value
        console.log("got email", email)
        setEnteredInputIsInvalid((prevValues) => ({
            ...prevValues,
            [identifier] : email.includes("@") && email.includes(".") ? false : true
        }))
        return
    }  
        
    if(type === 'firstAndLastName')
    {
        const splitFullName = event.target.value
        const userNameArray = splitFullName.split(" ")        
        // console.log("split firstLastName", userNameArray.length)
        setEnteredInputIsInvalid((prevValues) => ({
            ...prevValues,
            [identifier] : userNameArray[1] !== "" ? false : true
        }))
        return
    }  

    if(type === 'number')
    {
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

