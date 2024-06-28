

export default function OrderCard(){



    return(
        <>
            <section className="flex flex-col max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl text-center">OrderName</h1>
                    <section className="border-1 rounded-md bg-gray-300 px-4 py-6 my-2 border-l-zinc-500 text-center">
                        <section className="text-center">
                            <span className="pr-2 text-5xl">€</span>
                            <span className="text-5xl">100</span>
                        </section>
                        <span className="text-base pt-2">
                            Every month
                            <br />
                            One time purchase only
                        </span>
                    </section>
                    <section className="text-center">
                        <section className="py-5">
                            order description: Think of it like personal training in a group set up.
                        </section>
                        <section className="py-5">
                            valid: For two weeks / one month
                        </section>
                    </section>
                    <button className="rounded-md mb-5 py-4 text-gray-300 px-6 bg-green-700 hover:bg-green-600 hover:text-white">
                        Order Now
                    </button>
            </section>
        </>
    )
}