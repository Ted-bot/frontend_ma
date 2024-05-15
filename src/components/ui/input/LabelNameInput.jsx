import PhoneInput from 'react-phone-number-input/input'
import Select from 'react-select'

/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
export default function LabelNameInput({ 
    name, 
    type, 
    error, 
    cityList, 
    stateList,
    selectedStateIndexNr, 
    selectedCityIndexNr, 
    onChangeState,
    onChangeCity,
    ...props }) {

    let checkBox = 0
    let optionStateList = {}
    let optionCitiesList = {}

    const lowerCaseName = () => {
        let mutationString = name.toLowerCase();
        return mutationString
    }

    if(type === 'checkbox'){
        checkBox = 1
    }

    if(type === 'location'){
        optionStateList = stateList.map((state) => ({
            label: state.name,
            value: state.id
        }))
        
        optionCitiesList = cityList.map((state) => ({
            label: state.name,
            value: state.id
        }))

        console.log({newlist: optionStateList})
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
                                className={`${checkBox === 1 ? 'h-8 w-8 lg:h-12 lg:w-12 accent-orange-300' : 'w-full appearance-none'} ${error && 'border-red-500'} block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} 
                                id={lowerCaseName()}
                                name={lowerCaseName()} 
                                type={type}
                                autoComplete='off'
                                {...props}
                            />
                        : type === 'tel' ?
                            <PhoneInput
                                className={`${error && 'border-red-500'} w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                country="NL"
                                {...props}
                            />
                        :
                        <section className='flex flex-col flex-wrap w-full justify-evenly'>

                            <Select 
                                className={`w-full ${error && 'border-red-500'} block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}  
                                onChange={onChangeState}
                                inputId={selectedStateIndexNr}
                                options={optionStateList}
                                placeholder='select state ...'
                            />

                            <Select 
                                className={`w-full ${error && 'border-red-500'} block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}  
                                onChange={onChangeCity}
                                inputId={selectedCityIndexNr}
                                options={optionCitiesList}
                                placeholder='select city ...'
                            />
                        </ section>
                    }
                </label>
                {error && type === 'password' &&  <p className="text-red-500 text-xs italic">Please fill in a {lowerCaseName()} </p>}
                {error && type === 'text' &&  <p className="text-red-500 text-xs italic">Please fill in your {lowerCaseName()} </p>}
                {error && type == 'checkbox' &&  <p className="text-red-500 text-xs italic">Please fill gender</p>}
                {error && type == 'date' &&  <p className="text-red-500 text-xs italic">Sorry, only between the age of 7 and 60 years can sign in!</p>}
                {error && type == 'tel' &&  <p className="text-red-500 text-xs italic">Please fill in your {lowerCaseName()}</p>}
            </section>
        </>
    )
}
