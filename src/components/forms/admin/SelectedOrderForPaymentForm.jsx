import SelectedOrderForPaymentInterface from "../../interface/SelectedOrderForPaymentInterface"
import { 
    getLocalStorageItem
 } from "../../../js/util/postUtil"
// import { styled } from '@mui/material/styles'
import { alpha } from "@mui/material"
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

export default function SelectedOrderForPaymentForm({latestOrder}){

    const currencyType = 'EUR'

    return(
        <>
            <section className="flex flex-col justify-center shadow-md bg-slate-100 py-5 rounded-md px-3 sm:mx-4 sm:px-5 sm:w-full md:px-3 md:shadow-xl">

                <h1 className={`pt-3 pb-6 text-2xl text-center`}>Order</h1>
                <section className="flex-col col-span-full justify-items-stretch sm:grid-cols-none md:grid">
                    { latestOrder?.lastOrder != undefined && <SelectedOrderForPaymentInterface latestOrder={latestOrder.lastOrder} />}
                </section>
                
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
                                <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">{getLocalStorageItem(currencyType)} {latestOrder?.orderTotalProductPrice}</section>
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
                            <Box item sx={{ marginRight: '0px', marginLeft: 'auto', paddingRight: '1.2rem' }}>
                                <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">{getLocalStorageItem(currencyType)} {latestOrder?.orderTaxPrice}</section>
                            </Box>
                        </Grid>

                        <Divider sx={{marginRight: '1.2rem', marginLeft: '1.2rem' , borderBottomWidth: 5, marginTop: 2, marginBottom: 1, backgroundColor: alpha('#90caf9', 0.5) }} />

                        <Grid
                            container 
                            direction="row"
                            sx={{ flexGrow: 1}}
                        >
                            <Box item sx={{ paddingLeft: '1.2rem' }}>
                                <section className="font-bold text-blue-600/80 sm:text-lg md:text-xl">Total Amount : </section>
                            </Box>
                            <Box item sx={{ marginRight: '0px', marginLeft: 'auto', paddingRight: '1.2rem' }}>
                                <section className="font-bold text-blue-600/80 sm:text-lg md:text-xl">{getLocalStorageItem(currencyType)} {latestOrder?.orderTotalAmount}</section>
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