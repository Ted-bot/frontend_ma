import PhoneInput from 'react-phone-number-input/input'
import NativeSelect from '@mui/material/NativeSelect'
import { camelCaseToLoWithSpace } from '../../../js/util/postUtil'

/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
export default function LabelNameInput({ 
    id,
    name, 
    type, 
    error,
    invalid,
    cityId,
    cityList, 
    stateId,
    stateList,
    onChangeState,
    onChangeCity,
    ...props 
}) {

    let checkBox = 0
    let optionStateList = []
    let optionCitiesList = []
    const lowerCaseName = camelCaseToLoWithSpace(name)

    if(type === 'checkbox'){
        checkBox = 1
    }

    if(type === 'location'){
        optionStateList = stateList.map((state) => ({
            label: state.name,
            value: state.id
        }))
        
        optionCitiesList = cityList.map((city) => ({
            label: city.name,
            value: city.id
        }))
        console.log({stateId, cityId})
    }


    return (
        <>
            <section className={`${checkBox === 1 ? 'flex md:w-1/4' : 'w-full md:w-1/2'} lg:justify-center px-3 mb-6 md:mb-0`}>
                <label className={`${checkBox === 1 ? 'flex flex-col md:w-1/4' : 'w-full md:w-1/2'} tracking-wide text-gray-700 text-xs font-bold mb-2`}>
                    <section className={`${checkBox === 1 ? 'text-center' : ''}`}>
                        {name}                
                    </section>
                    {
                        (type != 'tel' && type != 'location') ? 
                            <input 
                                // error != undefined && error != ''
                                // invalid != undefined && invalid != ''
                                className={`${checkBox === 1 ? 'h-8 w-8 lg:h-12 lg:w-12 accent-orange-300' : 'w-full appearance-none'} 
                                ${error && 'border-red-500'} 
                                block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} 
                                id={id}
                                name={name} 
                                type={type}
                                {...props}
                            />
                        : type === 'tel' ?
                            <PhoneInput
                                // error != undefined && error != ''
                                // invalid != undefined && invalid != ''
                                className={`${error && 'border-red-500'} 
                                w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight 
                                focus:outline-none focus:bg-white`}
                                country="NL"
                                {...props}
                            />
                        :
                        <>
                            <section className='flex w-full justify-evenly'>
                                    <NativeSelect
                                        className={`${error && 'border-red-500 border '}w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id={stateId}
                                        onChange={(e) => onChangeState(e)}
                                        placeholder='select state ...' 
                                        value={stateId }
                                        
                                    >
                                        {
                                            optionStateList instanceof Array && 
                                            optionStateList.length > 0 && 
                                            optionStateList.map((value, index) => (<option key={index} value={value.value}>{value.label}</option>))
                                        }
                                    </NativeSelect>
                                    <NativeSelect
                                        className={`${error && 'border-red-500 border '}w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id={id}
                                        onChange={(e) => onChangeCity(e)}
                                        placeholder='select city ...'
                                        value={cityId}
                                        // autoFocus 
                                    >
                                        {
                                            optionCitiesList instanceof Array && 
                                            optionCitiesList.length > 0 && 
                                            optionCitiesList.map((value, index) => (<option key={index} value={value.value}>{value.label}</option>))
                                        }
                                    </NativeSelect>
                                </ section> 
                        </>
                    }
                </label>
                {invalid && type == 'password' &&  <p className="text-red-500 text-xs italic">Please fill in a {lowerCaseName} </p>}
                {/* {invalid && type == 'checkbox' &&  <p className="text-red-500 text-xs italic">Please set a {lowerCaseName} </p>}
                {invalid && type == 'gender' &&  <p className="text-red-500 text-xs italic">Please set a {lowerCaseName} </p>} */}
                {invalid && type == 'location' &&  <p className="text-red-500 text-xs italic">Please fill in a {lowerCaseName} </p>}
                {invalid && type == 'text' &&  <p className="text-red-500 text-xs italic">Please fill in your {lowerCaseName} </p>}
                {invalid && type == 'checkbox' &&  <p className="text-red-500 text-xs italic">Please fill gender</p>}
                {invalid && type == 'date' &&  <p className="text-red-500 text-xs italic">Sorry, only between the age of 7 and 60 years can sign in!</p>}
                {invalid && type == 'tel' &&  <p className="text-red-500 text-xs italic">Please fill in your {lowerCaseName}</p>}
                {(error != undefined && error != '') && <section className="text-red-500 text-xs italic">{error}</section>}
            </section>
        </>
    )
}
