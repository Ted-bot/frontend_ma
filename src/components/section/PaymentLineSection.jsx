import { alpha } from '@mui/material'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

export default function PaymentLineSection({ paymentCurrency, userData }) { 
    return (
        <>
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
                            <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">{paymentCurrency} {userData?.userOrder.orderTotalProductPrice}</section>
                        </Box>
                    </Grid>
                    <Grid container direction="row" sx={{ flexGrow: 1}}>
                        <Box sx={{ paddingLeft: '1.2rem' }}>
                            <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">tax (9%): </section>
                        </Box>
                        <Box sx={{ marginRight: '0px', marginLeft: 'auto', paddingRight: '1.2rem' }}>
                            <section className="font-medium text-neutral-500/80 sm:text-base md:text-lg">{paymentCurrency} {userData?.userOrder.orderTaxPrice}</section>
                        </Box>
                    </Grid>

                    <Divider sx={{marginRight: '1.2rem', marginLeft: '1.2rem' , borderBottomWidth: 5, marginTop: 2, marginBottom: 1, backgroundColor: alpha('#90caf9', 0.5) }} />

                    <Grid container direction="row" sx={{ flexGrow: 1}} >
                        <Box sx={{ paddingLeft: '1.2rem' }}>
                            <section className="font-bold text-blue-600/80 sm:text-lg md:text-xl">Total Amount : </section>
                        </Box>
                        <Box sx={{ marginRight: '0px', marginLeft: 'auto', paddingRight: '1.2rem' }}>
                            <section className="font-bold text-blue-600/80 sm:text-lg md:text-xl">{paymentCurrency} {userData?.userOrder.orderTotalAmount}</section>
                        </Box>
                    </Grid>
                </Box>
                
            </section>
        </>
    )
}
