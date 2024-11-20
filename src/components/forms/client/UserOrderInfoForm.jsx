import IconRight from "../../../assets/IconRight"
import IconUserLocation from "../../../assets/IconUserLocation"

const UserOrderInfoForm = ({userAddressModalHandler, enteredInput, user, errorClass, address}) => {

    return (
        <>
            <section className="grid md:justify-items-center">
                <section 
                    onClick={userAddressModalHandler}
                    className={`inline-flex border-4 ${errorClass !== 'false' ? errorClass : 'border-slate-300'} rounded-lg py-5 cursor-pointer sm:w-full md:w-3/5 hover:bg-slate-200`}
                >
                    <section className="grow-0 px-6 content-center"><IconUserLocation /></section>
                    <section className="grow flex-col">
                        <section className="text-clip overflow-hidden">{enteredInput.addressLine ?? address?.addressLine} {enteredInput.streetNumber ?? address?.streetNumber} {enteredInput.unitNumber ?? address?.unitNumber}</section>
                        <section>{enteredInput.postalCode ?? address?.postalCode} {enteredInput?.city ?? (address.city ? user.city : "")}</section>
                        <section>{enteredInput.firstAndLastName ?? user.firstAndLastName}</section>
                        <section>{enteredInput.phoneNumber ?? user.phoneNumber}</section>
                    </section>
                    <section className="grow-0 px-6 content-center"><IconRight /></section>
                </section>
            </section>
        </>
    )
}


export default UserOrderInfoForm