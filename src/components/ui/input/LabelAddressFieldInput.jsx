import NativeSelect from '@mui/material/NativeSelect'

export default function LabelAddressFieldInput({
    id,
    name,
    type,
    value,
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
        // const lowerCaseName = camelCaseToLoWithSpace(name)
    
        // if(type === 'checkbox'){
        //     checkBox = 1
        // }
    
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

    return (
        <>
        <section className={`w-full lg:justify-center px-3 mb-6 md:mb-0`}>
            <label htmlFor="">
                <section>
                    {name}
                </section>

            {
                (type != 'location') ?
                <input 
                // ${invalid != undefined && invalid != '' || error != undefined && error != '' && 'border-red-500'} 
                    className={`${(invalid != false && value == '') && 'border-red-500'}
                        w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`
                    } 
                    id={id}
                    name={name} 
                    type={type}
                    value={value}
                    {...props}
                />
                :
                <>
                    <section className='flex w-full justify-evenly'>
                            <NativeSelect
                                className={`w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                onChange={onChangeState}
                                placeholder='select state ...' 
                            >
                                {
                                    optionStateList instanceof Array && 
                                    optionStateList.length > 0 && 
                                    optionStateList.map((value, index) => (<option key={index} value={index}>{value.label}</option>))
                                }
                            </NativeSelect>
                            <NativeSelect
                                className={`w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                onChange={onChangeCity}
                                placeholder='select city ...'
                                autoFocus 
                            >
                                {
                                    optionCitiesList instanceof Array && 
                                    optionCitiesList.length > 0 && 
                                    optionCitiesList.map((value, index) => (<option key={index} value={index}>{value.label}</option>))
                                }
                            </NativeSelect>
                        </ section> 
                </>
                }
            </label>
            {invalid != false && value == '' && <p className="text-red-500 text-xs italic">Please fill in a {name} </p>}
        </section>
        </>
    )
}