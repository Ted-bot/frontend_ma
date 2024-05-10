import LabelNameInput from '../ui/input/LabelNameInput.jsx'

export default function Login() {

    const typeEmail = 'email'
    const typePassword = 'password'

    const InterfaceConfiguration = {
        title: 'Login',
        buttonname: 'Submit',
        setItems : [
            { name: 'Email', type: typeEmail, placeholder: 'Enter E-mail'},
            { name: 'Password', type: typePassword, placeholder: 'Enter Password'}
        ]
    }

    const createInterfaceForm = (array) => {
        const createListItems = array.map((item) => (
            <LabelNameInput 
                name={item.name}
                type={item.type}
                key={Math.floor(Math.random() * 1000)}
                {...item}
            />
        ))
        return createListItems
    } 

    return (
        <>
            <section className="flex flex-col items-center shadow-md bg-slate-100 py-5 rounded-md px-3 sm:mx-4 w-full sm:px-5 sm:w-4/5 md:px-3 md:shadow-xl">
                
                <h1 className="pt-3 pb-6 text-2xl">{InterfaceConfiguration.title}</h1>
                
                <form action="" className="w-full max-w-lg">
                    {/* <section className="flex flex-wrap -mx-3 mb-6"> */}
                       {createInterfaceForm(InterfaceConfiguration.setItems)}
                    {/* </section> */}

                    <button type="submit" className="w-full py-3 mt-10 bg-[#063970] rounded-md
                        font-medium text-white uppercase
                        focus:outline-none hover:shadow-none"
                    >
                        {InterfaceConfiguration.buttonname}
                    </button>
                </form>

            </section>
        </>
    )
}