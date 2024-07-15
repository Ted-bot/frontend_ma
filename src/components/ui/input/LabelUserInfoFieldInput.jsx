import NativeSelect from '@mui/material/NativeSelect'
import PhoneInput from 'react-phone-number-input/input'
import { useRef, useState } from 'react'

export default function LabelUserInfoFieldInput({
    id,
    name,
    type,
    value,
    defaultValueCity,
    defaultValueState,
    invalid,
    city,
    state,
    cityList, 
    stateList,
    onChangeState,
    onChangeCity,
    ...props}){

        let optionStateList = []
        let optionCitiesList = []
        const [userData, setUserData] = useState(null)
        const ref = useRef()
    
        if(type === 'location'){
            optionStateList = stateList.map((state) => ({
                label: state.name,
                value: state.id
            }))
            
            optionCitiesList = cityList.map((state) => ({
                label: state.name,
                value: state.id
            }))
        }

        if(type == 'tel'){
            console.log({phoneNumber:value})
        }

        if(type == 'location'){
            console.log({stateListOPtions:stateList})
            console.log({cityListOPtions:cityList})
            console.log({DefaultValueCity:defaultValueCity})
            console.log({DefaultValueState:defaultValueState})
        }


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
                // ${invalid != undefined && invalid != '' || error != undefined && error != '' && 'border-red-500'} 
                    className={`${(invalid != false && ref?.current?.value == '') && name != 'unitNumber' && 'border-red-500'}
                        w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`
                    } 
                    ref={ref}
                    id={id}
                    name={name} 
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
                        {...props}
                    />
                :
                <>
                    <section className='flex w-full justify-evenly'>
                            <NativeSelect
                                value={defaultValueState}
                                className={`w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                onChange={onChangeState}
                                placeholder='select state ...'
                            >
                                {
                                    optionStateList instanceof Array && 
                                    optionStateList?.length > 0 && 
                                    optionStateList?.map((value, index) => (<option key={index} value={value.value}>{value.label}</option>))
                                }
                            </NativeSelect>
                            <NativeSelect
                                value={defaultValueCity}
                                className={`w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                onChange={onChangeCity}
                                placeholder='select city ...'
                            >
                                {
                                    optionCitiesList instanceof Array && 
                                    optionCitiesList?.length > 0 && 
                                    optionCitiesList.map((value, index) => (<option key={index} value={value.value}>{value.label}</option>))
                                }
                            </NativeSelect>
                        </ section> 
                </>
                }
            </label>
            {console.log({invalid: invalid, name: name, value, value})}
            {invalid && name != 'unitNumber' && ref?.current?.value == '' && <p className="text-red-500 text-xs italic">Please fill in a {name} </p>}
        </section>
        </>
    )
}