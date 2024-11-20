import { Form } from 'react-router-dom'
import SelectPaymentMethodInterface from '../interface/SelectPaymentMethodInterface'

import Divider from '@mui/material/Divider'
import { alpha } from "@mui/material"
import Dialog from '@mui/material/Dialog'
import './CalendarModal.css'
import { styled} from '@mui/system'

const DialogComponent = styled('div',{
  name: 'CustomDialog',
  slot: 'Root',
  overridesResolver: (props, styles) => [
    styles.root,
    props.color === 'primary' && styles.primary,
    props.color === 'secondary' && styles.secondary,
  ],
})(({ theme }) => ({
    padding: "15px 20px 30px 20px",
  display: "flex",
  color: 'white',
  background: 'rgba(0 0 0 / 0.5)',
  borderRadius: '5px',
}))

const UserChoosePaymentModal = function UserDataModal({ dialog, closeDialog, paymentMethodOptions}){
    
    
    const submitHandler = () => {
        closeDialog()
    }

    return (
        <Dialog 
            open={dialog}
            fullWidth={true}
            sx={{ backdropFilter: "blur(5px) sepia(5%)", }} 
            PaperProps={{ sx: { borderRadius: "20px" } }}
        >
            <DialogComponent>
                
                <Form
                    name='address'
                    id={paymentMethodOptions.name}
                    className='w-full'
                >
                    <form
                        method="dialog"
                        className="flex float-end translate-y-4 z-10"
                    >
                        <button onClick={submitHandler} className='px-2 rounded-md hover:border-2 hover:border-rose-500 hover:bg-rose-300'>X</button>
                    </form>
                    <section>
                        <h1 className={`flex justify-center pt-3 pb-6 text-md md:text-xl lg:text-xl xl:text-2xl`}>Choose a Payment Method</h1>

                        <SelectPaymentMethodInterface availableMethods={paymentMethodOptions.fields} />
                        
                        <Divider sx={{ borderBottomWidth: 1, marginTop: 3, marginBottom: 3, backgroundColor: alpha('#90caf9', 0.5)}} variant="middle" component="div"  /> 

                        <button
                            onClick={submitHandler}
                            className="text-slate-100 h-16 w-42 px-8 align-content-center w-full rounded-b-full text-2xl rounded-t-full border-0 ring-2 shadow-xl ring-red-500 bg-red-500 bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300 hover:from-orange-400 hover:text-yellow-200 hover:to-red-400 hover:ring-red-400 hover:shadow-2xl"
                        >
                                Close
                        </button>
                    </section>
                </Form>
            </DialogComponent>
        </Dialog>
    )
}

export default UserChoosePaymentModal