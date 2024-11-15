export const handleKeyDown = (event, value, updateUserData) => {
    if(event.key !== "Backspace") return
    const eniProperty = value
    const backspaceInput = eniProperty.substring(0, eniProperty.length - 1)
    // pre define function so only take new value
    if(eniProperty.length > 0) updateUserData(backspaceInput) 
}