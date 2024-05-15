import PhoneInput from 'react-phone-number-input/input'

/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
export default function LabelNameInput({ name, type, error,...props }) {
    let checkBox = 0

    const lowerCaseName = () => {
        let mutationString = name.toLowerCase();
        return mutationString
    }

    if(type === 'checkbox'){
        checkBox = 1
    }

    return (
        <>
            <section className={`${checkBox === 1 ? 'flex md:w-1/4' : 'w-full md:w-1/2'} justify-center px-3 mb-6 md:mb-0`}>
                <label className={`${checkBox === 1 ? 'flex flex-col md:w-1/4' : 'w-full md:w-1/2'} tracking-wide text-gray-700 text-xs font-bold mb-2`}>
                    <section className={`${checkBox === 1 ? 'text-center' : ''}`}>
                        {name}                
                    </section>
                    {
                        type != 'tel' ? 
                            <input 
                                className={`${checkBox === 1 ? 'h-12 w-12 accent-orange-300' : 'w-full appearance-none'} ${error && 'border-red-500'} block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} 
                                id={lowerCaseName()}
                                name={lowerCaseName()} 
                                type={type}
                                autoComplete='off'
                                {...props}
                            />
                            :
                            <PhoneInput
                                className={`${error && 'border-red-500'} w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                country="NL"
                                {...props}
                            />
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
