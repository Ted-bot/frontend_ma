// import * as IBANValidator from 'iban-validator-js'
import * as ibantools from 'ibantools'
import { ValidationErrorsIBAN } from 'ibantools'
// import { BadRequestError } from '../exceptions/BadRequestError.js'
// import { useErrorBoundary } from "react-error-boundary"

// /**
//  * @param {string} event 
//  * @param setInvalidTypeStatus
//  * @returns {boolean}
//  *
//  * @throws BadRequestError
//  */
function validateAndSetStatus(event, setInvalidTypeStatus) {
  event.preventDefault()

  console.log({checkIBAN: event.target.value})
  let result
  try {
    const iban = ibantools.electronicFormatIBAN(event.target.value)
    result = ibantools.validateIBAN(iban)
  } catch (error) {
    setInvalidTypeStatus('iban', true)
  }
  
  if (!result.valid) {    
    // const errorsCsv = result.errorCodes.map(code => ValidationErrorsIBAN[code]).join(', ')
    setInvalidTypeStatus('iban', true)
    return false
  }

  setInvalidTypeStatus('iban', false)

  return true
}

function funcValidateIBAN(value){
  const iban = ibantools.electronicFormatIBAN(value)
  const result = ibantools.validateIBAN(iban)

  return result
}

export {validateAndSetStatus, funcValidateIBAN}