import SelectedOrderForPaymentInterface from "../../interface/SelectedOrderForPaymentInterface"
import { 
    getLocalStorageItem
 } from "../../../js/util/postUtil"
// import { styled } from '@mui/material/styles'
import { alpha } from "@mui/material"
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import UserOrderInfoForm from "./UserOrderInfoForm"

import IconRight from "../../../assets/IconRight"

export default function SelectedOrderForPaymentForm({latestOrder, handleClick, user, address}){

    const currencyType = 'EUR'
    const paymentCurrency = getLocalStorageItem(currencyType)

    return(
        <>
            <section className="flex-col shadow-md w-full bg-slate-100 py-5 rounded-md px-3 sm:mx-2 sm:px-5 md:grid md:mx-2 md:shadow-xl">

                <h1 className={`pt-3 pb-6 text-2xl text-center`}>Address & Peronsal Information</h1>

                <UserOrderInfoForm handleClick={handleClick} user={user} address={address} />

                <h1 className={`pt-3 pb-6 text-2xl text-center`}>Order</h1>

                { latestOrder?.lastOrder != undefined && <SelectedOrderForPaymentInterface latestOrder={latestOrder.lastOrder} />}
                
                <section>
                    <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)' }}>
                        <Grid 
                            container 
                            direction="row"
                            sx={{ display: 'flex'}}
                        >
                            <Box sx={{ paddingLeft: '1.2rem' }}>
                                <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">price : </section>
                            </Box>
                            <Box sx={{ marginRight: '0px', marginLeft: 'auto', paddingRight: '1.2rem' }}>
                                <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">{paymentCurrency} {latestOrder?.orderTotalProductPrice}</section>
                            </Box>
                        </Grid>
                        <Grid
                            container 
                            direction="row"
                            sx={{ flexGrow: 1}}
                        >
                            <Box sx={{ paddingLeft: '1.2rem' }}>
                                <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">tax (9%): </section>
                            </Box>
                            <Box sx={{ marginRight: '0px', marginLeft: 'auto', paddingRight: '1.2rem' }}>
                                <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">{paymentCurrency} {latestOrder?.orderTaxPrice}</section>
                            </Box>
                        </Grid>

                        <Divider sx={{marginRight: '1.2rem', marginLeft: '1.2rem' , borderBottomWidth: 5, marginTop: 2, marginBottom: 1, backgroundColor: alpha('#90caf9', 0.5) }} />

                        <Grid
                            container 
                            direction="row"
                            sx={{ flexGrow: 1}}
                        >
                            <Box sx={{ paddingLeft: '1.2rem' }}>
                                <section className="font-bold text-blue-600/80 sm:text-lg md:text-xl">Total Amount : </section>
                            </Box>
                            <Box sx={{ marginRight: '0px', marginLeft: 'auto', paddingRight: '1.2rem' }}>
                                <section className="font-bold text-blue-600/80 sm:text-lg md:text-xl">{paymentCurrency} {latestOrder?.orderTotalAmount}</section>
                            </Box>
                        </Grid>
                    </Box>
            </section>
        </section>
        {/* <form action="" name='address' id='address'> */}

            
        {/* </form> */}
        </>
    )
}