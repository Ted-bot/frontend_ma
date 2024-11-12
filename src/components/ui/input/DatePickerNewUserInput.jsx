import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import moment from 'moment/moment.js'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const minDate = () => {
    let currentDate = moment()
    let minDate = currentDate.subtract(65, 'years')
    return minDate.format('DD-MM-YYYY')
}

const maxDate = () => {
    let currentDate = moment()
    let maxDate = currentDate.subtract(17, 'years')
    return maxDate.format('DD-MM-YYYY')   
}    

export const DatePickerNewUserInput = ({name, onChange, onBlur}) => {       

    const maxDateObj = dayjs(maxDate())
    const minDateObj = dayjs(minDate())
    const [checkBoxError, setCheckBoxError] = useState(null)

    const errorMessage = useMemo(() => {
        switch (checkBoxError) {
            case "maxDate": {
                return "Registration age cannot be younger than 17"
            }
            case "minDate": {
                return "Registration age unfortunatley cannot be older than 65"
            }
            case "invalidDate": {
                return "Your date is not valid";
            }
            default: {
                return "";
            }
        }
    }, [checkBoxError, onBlur])

    return <DatePicker 
        minDate={minDateObj}
        maxDate={maxDateObj}
        format='DD/MM/YYYY'
        className={`w-full`}
        label={name}
        onChange={(value) => {
            onChange(dayjs(value).format('YYYY-MM-DD'))
            onBlur(false)
        }}
        onError={(newError) => {
            console.log({'Error Error Date':newError})
            setCheckBoxError(newError)
            if(newError != 'invalidDate'){
                onBlur(true)
                setTimeout(() => {
                    onBlur(false)
                }, 3000)
            }
        }}
        slotProps={{
            textField: {
                helperText: errorMessage,
            },
        }}
        disableFuture
    />
}
    