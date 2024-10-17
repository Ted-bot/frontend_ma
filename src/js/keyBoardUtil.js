export const handleKeyDown = (identifier,event) => {
    if(event.key !== "Backspace") return
    const eniProperty = enteredInput[identifier]
    const backspaceInput = eniProperty.substring(0, eniProperty.length - 1)
    // console.log({keyPressed: event.key, identifier, eniProperty, checkLength: eniProperty.length, backspaceInput})
    if(eniProperty.length > 0) updateUserData( identifier, backspaceInput)
}