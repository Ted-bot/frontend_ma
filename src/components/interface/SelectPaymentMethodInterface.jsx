import CustomPaymentOptionButton from "../ui/button/CustomPaymentOptionButton"

const SelectPaymentMethodInterface = ({availableMethods}) => {

    // console.log({availableMethods })
    return availableMethods.map((option) => (
        <CustomPaymentOptionButton {...option} key={option.id} />
    ))
}

export default SelectPaymentMethodInterface