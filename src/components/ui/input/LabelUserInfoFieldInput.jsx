import { useRef, useState, useContext } from 'react'
import {OrderContext} from '../../../store/shop-order-context'
import NativeSelect from '@mui/material/NativeSelect'
import PhoneInput from 'react-phone-number-input/input'
// import { OrderContext } from '../../../store/shop-order-context';


export default function LabelUserInfoFieldInput({
    id,
    state_id,
    name,
    type,
    value,
    invalid,
    ...props}){


        const {availableCities, availableStates, currentUserState, currentUserCity, userSelectedLocation} = useContext(OrderContext)
        let optionStateList = []
        let optionCitiesList = []
        // const [userData, setUserData] = useState(null)
        const ref = useRef()
    
        if(type === 'location'){
            optionStateList = availableStates.map((state) => ({
                label: state.name,
                value: state.id
            }))
            
            optionCitiesList = availableCities.map((city) => ({
                label: city.name,
                value: city.id
            }))
        }

        if(type == 'tel'){
            console.log({phoneNumber:value})
        }

        console.log({availableCities: optionCitiesList})

    return (
        <>
        <section className={`w-full lg:justify-center px-3 mb-6 md:mb-0`}>
            <label htmlFor="">
                <section>
                    {name}
                </section>
            {
                (type != 'location' && type != 'tel') ?
                <input 
                // ${ error != undefined && error != '' && 'border-red-500'} 
                    className={`${(invalid != false && id != 'unit_number' && ref?.current?.value == '') && name != 'unitNumber' && 'border-red-500'}
                        w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`
                    } 
                    ref={ref}
                    id={id}
                    // name={name} 
                    type={type}
                    defaultValue={value}
                    {...props}
                />
                : type == 'tel' ?
                    <PhoneInput
                        className={`${invalid && ref?.current?.value == ''
                            // || error != undefined && error != '' 
                            && 'border-red-500'} 
                        w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight 
                        focus:outline-none focus:bg-white`}
                        country="NL"
                        ref={ref}
                        value={`+31${value}`}
                        // value={`0031${value}`}
                        id={id}
                        // name={id}
                        {...props}
                    />
                :
                    <section className='flex w-full justify-evenly'>
                        <NativeSelect
                            className={`w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                            onChange={(e) => userSelectedLocation('state', e)}
                            value={currentUserState}
                            id={state_id}
                        >
                            {
                                optionStateList instanceof Array && 
                                optionStateList?.length > 0 && 
                                optionStateList?.map((value, index) => (<option key={index} value={value.value}>{value.label}</option>))
                            }
                        </NativeSelect>
                        <NativeSelect
                            className={`w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                            id={id}
                            onChange={(e) => userSelectedLocation('city', e)}
                            value={currentUserCity}
                        >
                            {
                                optionCitiesList instanceof Array && 
                                optionCitiesList?.length > 0 && 
                                optionCitiesList.map((value, index) => (<option key={index} value={value.value}>{value.label}</option>))
                            }
                        </NativeSelect>
                    </ section>
                }
            </label>
            {/* {console.log({invalid: invalid, name: name, value, value})} */}
            {invalid && id != 'unit_number' && ref?.current?.value == '' && <p className="text-red-500 text-xs italic">Please fill in a {name} </p>}
        </section>
        </>
    )
}