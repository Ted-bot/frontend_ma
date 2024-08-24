import IconRight from "../../../assets/IconRight"
import IconUserLocation from "../../../assets/IconUserLocation"

const UserOrderInfoForm = ({userAddressModalHandler, user, address}) => {

    
    return (
        <>
            <section className="grid justify-items-center">
                <section 
                    onClick={userAddressModalHandler}
                    className="inline-flex border-4 rounded-lg border-slate-300 py-5 cursor-pointer sm:w-full md:w-3/5 hover:bg-slate-200"
                >
                    <section className="grow-0 px-6 content-center"><IconUserLocation /></section>
                    <section className="grow flex-col">
                        <section className="text-clip overflow-hidden">{address?.streetName} {address?.streetNumber} {address?.unitNumber}</section>
                        <section>{address?.postalCode} {user.city}</section>
                        <section>{user.firstAndLastName}</section>
                        <section>{user.phoneNumber}</section>
                    </section>
                    <section className="grow-0 px-6 content-center"><IconRight /></section>
                </section>
            </section>
        </>
    )
}


export default UserOrderInfoForm